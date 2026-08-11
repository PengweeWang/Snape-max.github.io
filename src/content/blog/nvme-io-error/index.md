---
title: 记一次NVMe硬盘在Linux下I/O报错的排查与解决
description: 记录 Linux 安装时 NVMe 硬盘 I/O 报错（sct 0x3 / sc 0x71）的排查过程，以及通过关闭 ASPM 和 NVMe 省电状态修复的方法。
publishDate: '2026-08-11'
tags:
- linux
- nvme
- 故障排查
draft: false
language: Chinese
comment: true
ai: human
---

最近给一台机器装Linux，遇到了一个问题：硬盘能识别，但是安装时无法选择这块硬盘。启动时存在`nvme0n1: I/O Cmd(0x2) @ LBA 5425152, 8 blocks, I/O Error (sct 0x3 / sc 0x71)`错误。

## Technical Context and Analysis

硬盘接口是主板的M.2 接口，在Live CD中使用`lsblk`能看到NVMe固态硬盘（`nvme0n1`）及其分区，但无法识别容量以及安装时无法选择此硬盘。通过USB外接此块硬盘进行时安装可以选择该硬盘并启动，但是移动回主板的M.2 接口后系统启动出现`I/O Error (sct 0x3 / sc 0x71)`，接着是`Buffer I/O error on dev nvme0n1p3`，然后系统放弃启动。说明问题出在M.2接口的传输路径上，而不是硬盘本身。


查看启动日志，关键信息是：`nvme0n1: I/O Cmd(0x2) @ LBA 5425152, 8 blocks, I/O Error (sct 0x3 / sc 0x71)`。`sct 0x3 / sc 0x71`在NVMe规范中对应“链路训练失败”或“信号完整性错误”，属于物理层传输问题，不是文件系统损坏。


解决方案是在内核启动参数中添加以下两项：

```
pcie_aspm=off nvme_core.default_ps_max_latency_us=0
```

如果是安装盘启动，在GRUB菜单按`e`编辑，找到`linux`开头的行，在末尾添加上述参数，按`Ctrl+X`启动。如果已安装的系统无法启动，用USB进入Live环境，挂载硬盘的根分区和EFI分区，chroot进去，修改`/etc/default/grub`中的`GRUB_CMDLINE_LINUX`，添加同样参数，然后执行`grub2-mkconfig`更新引导配置。

`pcie_aspm=off`关闭PCIe链路层的动态电源管理。ASPM允许设备在空闲时进入低功耗状态，每次状态切换会改变链路电气特性。如果信号完整性本身处于临界状态，切换可能直接导致传输失败。关闭后链路保持恒定工作状态。

`nvme_core.default_ps_max_latency_us=0`禁止硬盘进入任何省电状态。NVMe硬盘有多级电源状态，切换需要时间，唤醒后需重新稳定传输环境。设为0强制硬盘始终处于最高性能状态，避免因唤醒时机导致的超时。

这两个参数本质上是关闭节能优化，换稳定性。代价是功耗略有增加，极端负载下可能损失少量峰值性能。
