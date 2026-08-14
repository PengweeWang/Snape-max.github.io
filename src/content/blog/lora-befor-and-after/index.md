---
title: LoRA 学习笔记：从 Intrinsic dimensionality 到 QLoRA 与 LoRA+
description: 记录内在维度、LoRA、QLoRA 与 LoRA+ 四篇论文的核心思想与关键实验结论。
publishDate: '2026-08-14'
tags:
- lora
- deep learning
- 模型微调
heroImage:
  src: ./lora.png
  alt: LoRA 学习笔记：从 Intrinsic dimensionality 到 QLoRA 与 LoRA+
  color: '#D0D1D3'
draft: false
language: Chinese
comment: true
ai: human
---

### Intrinsic dimensionality explains the effectiveness of language model finetuning

这篇论文是LoRA的前置论文之一，提出了Intrinsic dimensionality的概念。目标函数的内在维度衡量的是达到该目标函数满意解所需的最少参数数量，或者说表示在某个近似误差水平内，可以优化原始目标函数的最低维子空间。精确计算目标函数的内在维度在计算上难以处理，因此通常使用启发式的方法计算其上界。假设 $\theta^{D} = [\theta_0,\, \theta_1,\, \dots, \theta_m]$是模型的一组参数，可以通过优化一个$d$维子空间并通过重参数化（投影）来微调模型，可以表示为

$$
\theta^D = \theta_0^D + P(\theta^d)
$$

$P(\cdot)$即表示为从$d$维到模型参数的投影矩阵。论文使用了两种测算方法，一种是DID（Direct Intrinsic Dimension），使用全局统一随机投影（Fastfood 变换降低显存占用）不区分模型分层结构。另一种是SAID（Structure-Aware Intrinsic Dimension，分层结构感知）为每一层引入可学习缩放系数$\lambda_i$，将低维容量分配给对任务更关键的层

通过这种方法，可以通过实验获得仅用低维参数优化,达到某个性能测度时对应的最小维度。实验中采用$d_{90}$,达到全量参数微调 90% 性能时对应的最小维度。确定d的方法是随机采样/二分法

实验结论是，随着预训练表示参数数量的增加，内在维度会降低。论文中还涉及了关于压缩（模型压缩、表征压缩等等）的内容

### LORA: LOW-RANK ADAPTATION OF LARGE LANGUAGE MODELS

这篇论文承接上篇论文的结论并做出假设：模型在微调过程中的权重变化也有较低的Intrinsic dimensionality，从而可以通过优化模型参数的一个低维子空间实现微调，同时低秩矩阵可以分解成两个瘦长矩阵的乘积。

用数学语言表示出来即：模型全量微调是表示为 $W=W_0+\Delta W$，其中$\Delta W$是参数的更新量，论文假设其也具有低秩性，因此可以将其分解为$\Delta W = BA$，其中$W_0 \in \mathbb{R}^{d\times k}$，$B \in \mathbb{R}^{d\times r},\ A \in \mathbb{R}^{r\times k}$，并且$r \ll \min(d,k)$。

Details：矩阵 A 采用随机高斯初始化，矩阵 B 初始化为零，保证训练初始阶段低秩分支输出为 0，不破坏预训练权重的语义。

实验说明了三部分：1）是对$W_q$和 $W_v$进行LoRA微调最有效，仅$W_q$ 或 $W_k$性能显著下降。2）是极低的秩（如 $r$\=1、$r$\=4）即可达到饱和性能，继续增大 $r$ 不会带来显著收益；3）是$\Delta W$并非放大预训练权重的主奇异方向，而是放大预训练中权重占比低、但对下游任务重要的特征方向，且放大倍数可达 20 倍以上；说明 LoRA 本质是对预训练模型的 "任务相关特征定向增强"。

实验过程中的理论分析方法值得学习，例如奇异值分解分析，关于线性代数的知识还需要补充学习。

### QLORA: Efficient Finetuning of Quantized LLMs

QLoRA主要是使用NF4（4-bit NormalFloat，新的量化格式）量化、 Double Quantization，进一步降低显存占用，以及Paged Optimizers利用 NVIDIA 统一内存，将优化器状态自动在 GPU 显存与 CPU 内存间换页，解决长序列训练时梯度检查点带来的显存峰值溢出问题；重点是计算时临时把基座权重反量化为BF16，梯度、LoRA参数都是BF16存储保证精度不丢失。


### LoRA+: Efficient Low Rank Adaptation of Large Models

LoRA+主要是对AB设置不同的学习率使AB能够高效学习。

LoRA更新时$\Delta W = BA$，由于$A$和$B$形状以及位置不同，导致在梯度更新时两者随宽度 n 的缩放规律完全不一样，其中A 的梯度里包含输入长向量 $\underline{Z}$，求和后会放大 n 倍；B 的梯度只包含低秩中间特征 $$Z_A$，和 n 无关；

因此，在实际参数更新中B 学习率必须远大于 A，保证A，B都能有效学习。论文中使用

$$\eta_B = \lambda \cdot \eta_A,\quad \lambda \gg 1$$

此时，参数更新时 $A \leftarrow A - \eta_A G_A,\quad B \leftarrow B - \lambda \eta_A G_B$




