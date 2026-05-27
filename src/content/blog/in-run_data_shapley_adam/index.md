---
title: 'In-Run Data Shapley for Adam Optimizer'
description: '本文介绍了 In-Run Data Shapley 针对 Adam 优化器的适配方法，包括闭式解和线性化近似。'
publishDate: '2026-05-28'
tags:
  - machine learning
  - adam
  - data shapley
  - 数据估值
language: 'Chinese'
ai: 'assisted'
---
| 项目 | 内容 |
|------|------|
| **发表会议** | ICLR 2026 3rd DATA-FM Workshop |
| **PDF** | [arxiv.org/pdf/2602.00329](https://arxiv.org/pdf/2602.00329) |

上篇提到的In-Run Data Shapley不能直接应用于Adam优化器，因为Adam 的参数更新不是梯度的线性函数，本片论文对In-Run Data Shapley进行了Adam优化器适配。

## Adam优化器

Adam（Adaptive Moment Estimation）结合了两种经典优化思想：

- **Momentum（动量）**：利用梯度的一阶矩（均值）加速收敛，抑制震荡
- **RMSProp（自适应学习率）**：利用梯度的二阶矩（方差）对每个参数自适应调整学习率

### 算法流程

**输入**：学习率 $\eta$（默认 0.001），衰减率 $\beta_1=0.9$，$\beta_2=0.999$，数值稳定项 $\epsilon=10^{-8}$

**初始化**：$m_0 = 0$，$v_0 = 0$，$t = 0$

**每步更新**（对训练样本 $z_t$ 计算梯度 $g_t = \nabla \ell(w_{t-1}, z_t)$）：

1. 更新步数：$t \leftarrow t + 1$

2. 更新一阶矩（梯度均值）：
   $$m_t = \beta_1 \, m_{t-1} + (1 - \beta_1) \, g_t$$

3. 更新二阶矩（梯度方差）：
   $$v_t = \beta_2 \, v_{t-1} + (1 - \beta_2) \, g_t^2$$

4. 偏差修正：
   $$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}$$

5. 参数更新：
   $$w_t = w_{t-1} - \eta \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}$$

### 各组件作用

**一阶矩 $m_t$（动量）**

$m_t$ 是梯度的指数移动平均，记录了梯度的"方向趋势"。相比 SGD 直接用当前梯度 $g_t$ 更新，动量可以：
- 在一致方向上加速（累积历史梯度）
- 在震荡方向上抑制（正负梯度相互抵消）

**二阶矩 $v_t$（自适应缩放）**

$v_t$ 是梯度平方的指数移动平均，记录了每个参数梯度的"历史波动幅度"。更新时除以 $\sqrt{\hat{v}_t}$ 实现自适应：
- 梯度波动大的参数（$\sqrt{\hat{v}_t}$ 大）→ 学习率被缩小，更新更保守
- 梯度波动小的参数（$\sqrt{\hat{v}_t}$ 小）→ 学习率被放大，更新更激进

这使得 Adam 对不同参数能自动调节步长，特别适合稀疏梯度或参数尺度差异大的场景。

**偏差修正**

由于 $m_0 = v_0 = 0$，训练初期 $m_t$ 和 $v_t$ 偏向零。除以 $(1-\beta^t)$ 进行修正：
- $t$ 小时，$\beta^t \approx 1$，修正系数 $\frac{1}{1-\beta^t}$ 很大，补偿零初始化的偏差
- $t$ 大时，$\beta^t \to 0$，修正系数趋于 1，修正效果消失

**$\epsilon$ 的作用**

$\epsilon$（通常 $10^{-8}$）加在分母中防止除零，保证数值稳定。

## 闭式Adam Shapley

第一步不变，对局部效用函数做一阶Taylor展开：

$$
U^{(t)}(S) = \ell(\tilde{w}_{t+1}(S), z^{\text{val}}) - \ell(w_t, z^{\text{val}}) = \underbrace{\nabla \ell(w_t, z^{\text{val}}) \cdot (\tilde{w}_{t+1}(S) - w_t)}_{U_{(1)}^{(t)}(S)} + \text{高阶项}
$$

**第二步：代入Adam更新规则**

已知 $\tilde{w}_{t+1}(S) = w_t - \eta_t \sum_{z \in S} \frac{\hat{m}_t(z)}{\sqrt{v_t(z)}+\epsilon}$，对于子集 $S$ 和加入样本 $z$ 后的边际贡献：

$$
U_{(1)}^{(t)}(S \cup z) - U_{(1)}^{(t)}(S) = -\eta_t \, \nabla \ell(w_t, z^{\text{val}}) \cdot \frac{\hat{m}_t(z)}{\sqrt{\hat{v}_t(z)}+\epsilon}
$$

> 这一步需要假设Adam的动量状态 $m_t$ 和方差状态 $v_t$是固定值（常量）

可以看出一阶近似下，边际贡献与子集 $S$ 无关，因此：


$$
\phi_z(U_{(1)}^{(t)}) = -\eta_t \, \nabla \ell(w_t, z^{\text{val}}) \cdot \frac{m_t}{\sqrt{v_t}+\epsilon}
$$

最后利用Shapley的可加性，全局Shapley值为各步之和：$\phi_z(U) \approx \sum_{t=0}^{T-1} \phi_z(U_{(1)}^{(t)})$。


## 计算优化：Linearized Ghost Approximation

**思路**：将 Adam 的非线性更新方向线性化，使其可表示为梯度的线性组合

将乘积右边分为$\hat{m}_t(z)$和$\frac{1}{\sqrt{\hat{v}_t(z)}+\epsilon}$，**对于第一项**展开可得：

$$
\hat{m}_t = \frac{\beta_1}{1-\beta_1^t} m_{t-1} + \frac{1-\beta_1}{1-\beta_1^t} g_t = C_m^1 \, m_{t-1}(z) + C_m^2 \, g_t(z)
$$

**对于第二项**，做一阶泰勒展开：

首先，将 $\hat{v}_t$ 分解为历史部分和当前梯度扰动：

$$\hat{v}_t = \frac{\beta_2 v_{t-1} + (1-\beta_2) g_t^2}{1-\beta_2^t} \approx \hat{v}_{t-1} + C_v \, \nabla \ell(w_t, z)^2$$

其中 $C_v = \frac{1-\beta_2}{1-\beta_2^t}$。令 $\delta = C_v \, \nabla \ell(w_t, z)^2$ 为扰动量，则 $\hat{v}_t \approx \hat{v}_{t-1} + \delta$。

定义函数 $f(x) = \frac{1}{\sqrt{x}+\epsilon}$，在展开点 $x_0 = \hat{v}_{t-1}$ 处：

$$f(x_0) = \frac{1}{\sqrt{\hat{v}_{t-1}}+\epsilon} = \frac{1}{A_t(z)}$$

其中 $A_t(z) = \sqrt{\hat{v}_{t-1}(z)} + \epsilon$ 是基于历史状态的预条件项。

对 $f(x)$ 求导：

$$f'(x) = -\frac{1}{2(\sqrt{x}+\epsilon)^2 \sqrt{x}}$$

在 $x_0$ 处近似（假设 $\sqrt{x} \approx \sqrt{x}+\epsilon$ 用于导数量级估计）：

$$f'(x_0) \approx -\frac{1}{2 A_t(z)^3}$$

由一阶 Taylor 展开 $f(x_0 + \delta) \approx f(x_0) + f'(x_0) \cdot \delta$，代入 $\delta = C_v \, \nabla \ell(w_t, z)^2$：

$$\frac{1}{\sqrt{\hat{v}_t}+\epsilon} \approx \frac{1}{A_t(z)} - \frac{C_v \, \nabla \ell(w_t, z)^2}{2 A_t(z)^3}$$

最后相乘，去掉 $O(g_t^2)$ 和 $O(g_t^3)$ 的高阶项得到：

$$
\phi_z \approx \underbrace{-\eta_t \, \nabla \ell_{\text{val}} \cdot \frac{C_m^1 \, m_{t-1}}{A_t}}_{\text{History Term}} + \underbrace{-\eta_t \, \nabla \ell_{\text{val}} \cdot \left(\frac{C_m^2}{A_t} \odot g_t(z)\right)}_{\text{Linear Gradient Term}}
$$

对于History Term还是要计算验证梯度$\nabla \ell_{\text{val}}$，但是只需计算一次

Linear Gradient Term可以使用Ghost Dot-Product 高效计算。

