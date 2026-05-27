---
title: Data Shapley in One Training Run
description: 'ICLR 2025 Outstanding Paper Runner-Up: 通过 Ghost Dot-Product 在一次训练中高效计算所有样本的 Data Shapley 值，支持一阶和二阶闭式解近似。'
publishDate: '2026-05-27'
tags:
  - Data Shapley
  - ICLR
  - XAI
  - machine learning
  - 数据估值
heroImage:
  src: './framework.png'
  alt: 'Data Shapley in One Training Run'
  color: '#FAC3A6'
language: Chinese
comment: true
ai: assisted
---

| 项目 | 内容 |
|------|------|
| **发表会议** | ICLR 2025 Outstanding Paper Runner-Up 🏆 |
| **PDF** | [arxiv.org/pdf/2406.11011](https://arxiv.org/pdf/2406.11011) |
| **代码** | [github.com/Jiachen-T-Wang/GhostSuite](https://github.com/Jiachen-T-Wang/GhostSuite) |


深度学习中一个核心问题是如何**公平地量化每个训练样本对模型性能的贡献**，Data Shapley是其中一种方案。但是原始的Shapley
值的计算需要重复训练，对于大规模数据集计算 impractical。In-run Data Shapley提供了一种一次训练即可得到所有样本
Shapley 值的方法。

## 原始 Data Shapley

### 定义

将训练集 $D = \{z_1, z_2, ..., z_n\}$ 看作合作博弈中的 $n$ 个"玩家"，学习算法 $A$ 为博弈规则，效用函数 $V(S)$ 为在子集 $S \subseteq D$ 上训练得到的模型在固定验证集上的性能（如准确率或负损失）。那么样本 $z_i$ 的 **Data Shapley Value** 定义为所有可能子集的加权边际贡献之和：

$$
\phi_i = \frac{1}{n} \sum_{k=0}^{n-1} \binom{n-1}{k}^{-1} \sum_{\substack{S \subseteq D \setminus \{i\} \\ |S| = k}} \big[ V(S \cup \{i\}) - V(S) \big]
$$

这等价于：

$$
\phi_i = \frac{1}{n!} \sum_{\pi \in \Pi} \big[ V(P_i^\pi \cup \{i\}) - V(P_i^\pi) \big]
$$

其中 $P_i^\pi$ 是在排列 $\pi$ 中排在 $i$ 之前的所有样本。

### 性质

Data Shapley 是唯一同时满足以下性质的估值方法：

| 公理 | 含义 |
|------|------|
| **Null Player（零贡献）** | 如果一个样本加入任何子集都不改变模型性能，其 Shapley 值为 0 |
| **Symmetry（对称性）** | 如果两个样本对所有子集的边际贡献完全相同，它们的 Shapley 值相等 |
| **Additivity（可加性）** | 如果性能由两个指标 $V+W$ 衡量，Shapley 值满足 $\phi_i(V+W) = \phi_i(V) + \phi_i(W)$ |
| **Efficiency（效率）** | 所有样本的 Shapley 值之和等于 $V(D) - V(\emptyset)$（即总效用增量） |

显然，如果要精确计算规模为`n`的数据集需要对 $2^n$ 个子集训练模型，**计算复杂度为 $O(2^n)$**，对大规模数据集完全不可行。


## In-Run Data Shapley

论文定义局部效用函数：

$$
U^{(t)}(S) = \ell(\tilde{w}_{t+1}(S), z^{\text{val}}) - \ell(w_t, z^{\text{val}})
$$

其中 $\tilde{w}_{t+1}(S) = w_t - \eta_t \sum_{z \in S} \nabla \ell(w_t, z)$，表示只用子集 $S \subseteq \text{batch}$ 做梯度更新后的参数。其含义为在第 $t$ 步迭代中，如果只使用 $S$ 中的数据做梯度更新，验证集损失的变化量。

将上式 $U^{(t)}(S)$ 中 $\ell(w, z^{\text{val}})$ 视为关于参数 $w$ 的多元标量函数，在 $w_t$ 处做二阶泰勒展开。

> $$
>  f(w) = f(w_t) + \nabla f(w_t)^T (w - w_t) + \frac{1}{2} (w - w_t)^T \nabla^2 f(w_t) (w - w_t) + O(\|w - w_t\|^3)
> $$

可得

$$
U^{(t)}(S) = \underbrace{-\eta_t \sum_{z \in S} \nabla \ell(w_t, z^{\text{val}}) \cdot \nabla \ell(w_t, z)}_{U_1(S)} + \frac{1}{2} \underbrace{\eta_t^2 \left(\sum_{z \in S} \nabla \ell(w_t, z)\right)^T H_t \left(\sum_{z \in S} \nabla \ell(w_t, z)\right)}_{U_2(S)} + O(\eta_t^3)
$$

先给答案，一阶近似下的 In-Run Data Shapley 有闭式解：

$$
\phi_z(U) \approx \sum_{t=0}^{T-1} \phi_z(U_1^{(t)})
$$

其中对每一步 $t = 0, \ldots, T-1$：

$$
\phi_z(U_1^{(t)}) = -\eta_t \; \nabla\ell(w_t, z^{\text{val}}) \cdot \nabla\ell(w_t, z)
$$

二阶近似下的 In-Run Data Shapley 也有闭式解：

$$
\phi_z(U) \approx \sum_{t=0}^{T-1} \left( \phi_z(U_1^{(t)}) + \frac{1}{2} \phi_z(U_2^{(t)}) \right)
$$

其中对每一步 $t = 0, \ldots, T-1$，组合后的单步公式为：

$$
\phi_z(U_1^{(t)}) + \frac{1}{2} \phi_z(U_2^{(t)}) = -\eta_t \; \nabla\ell(w_t, z^{\text{val}}) \cdot \nabla\ell(w_t, z) + \frac{\eta_t^2}{2} \; \nabla\ell(w_t, z)^\top H_t \left( \sum_{z_j \in \text{batch}} \nabla\ell(w_t, z_j) \right)
$$

第一项衡量训练样本 $z$ 对验证样本损失的直接影响（梯度方向对齐），第二项捕捉 $z$ 与 batch 中其他样本的交互（通过 Hessian 矩阵调整）。


### 一阶近似及计算技巧

对于一阶 In-run Data Shapley，$U_1$ 是"可加和效用函数"，满足：

$$
U_1(S) = \sum_{z \in S} f(z)
$$

即集合的效用等于集合中**每个样本各自贡献的简单加和**，每个 $f(z)$ 只依赖于 $z$ 自身，与其他样本无关。

则有：

$$
U_1(S \cup \{z\}) - U_1(S) = \left(f(z) + \sum_{z_i \in S} f(z_i)\right) - \sum_{z_i \in S} f(z_i) = f(z)
$$

那么，代入 Shapley 值定义可得：

$$
\phi_z(U_1) = \frac{1}{N} \sum_{k=1}^N \binom{N-1}{k-1}^{-1} \sum_{S \subseteq D_{-z}, |S|=k-1} f(z) = f(z) \cdot \frac{1}{N} \sum_{k=1}^N \binom{N-1}{k-1}^{-1} \binom{N-1}{k-1} = f(z)
$$


因此：

$$
\phi_z(U_1) = -\eta_t \nabla\ell(w_t, z^{\text{val}}) \cdot \nabla\ell(w_t, z)
$$

其中 $\nabla\ell(w_t, z^{\text{val}})$ 为验证梯度， $\nabla\ell(w_t, z)$ 为训练梯度，其仍满足shapley值四大公理。

注意上式只用了验证集一个点用于计算shapley值，但由于可加性，因此可以轻易拓展到整个验证集。

#### 个人理解

可以这样理解：验证梯度是验证点想让模型向哪个方向走，训练梯度是训练样本想让模型往哪个方向走，两个方向一致说明$z$是
正贡献，方向相反说明则是负贡献。

对于一阶shapley值的相对大小，将 $s_z := \phi_z(U_1) = -\eta_t \nabla\ell(z^{\text{val}}) \cdot \nabla\ell(z)$ 分解：

$$
s_z = -\eta_t \; \|\nabla\ell(z^{\text{val}})\| \; \|\nabla\ell(z)\| \; \cos\theta
$$

由于 $\nabla\ell(z^{\text{val}})$ 和 $\eta_t$ 在同一 batch 内对所有样本是公共的，则样本间的相对价值取决于两个因素：

| 因素 | 含义 | 对得分的影响 |
|---|---|---|
| $\|\nabla\ell(z)\|$（梯度范数） | 该样本在当前参数处的"陡峭程度"——模型对该样本的预测"自信"还是"不自信" | 范数大 → 该样本的单步影响大（无论正负） |
| $\cos\theta$（方向对齐度） | 该样本降低自身损失的方向与降低验证损失的方向是否一致 | 越一致 → 正贡献越大；越相反 → 负贡献越大 |

更具象的类比：把模型训练想象成众人划船：

- **验证梯度** = 船想去的方向（目标方向）
- **每个样本的梯度** = 每个人划船的方向和力气
- **$\|\nabla\ell(z)\|$** = 这个人划得有多用力
- **$\cos\theta$** = 这个人划的方向和船要去的方向是否一致

相对贡献的理解：

- 两个人都在正向划（正贡献），但一个人划得更用力（梯度范数大），他的贡献就更大
- 两个人用同样的力气，但一个人划的方向和船头方向更对齐（$\cos\theta$ 更大），他的贡献就更大

以上分析同时可以看出：验证集的质量非常重要。

#### 计算技巧：Ghost Dot-Product 

对线性层 $\mathbf{s} = \mathbf{a}\mathbf{W}$（$\mathbf{W} \in \mathbb{R}^{d_1 \times d_2}$），链式法则给出：

$$ \frac{\partial \ell^{(i)}}{\partial \mathbf{W}} = \frac{\partial \ell^{(i)}}{\partial \mathbf{s}^{(i)}} \otimes \mathbf{a}^{(i)} = \mathbf{b}^{(i)} \otimes \mathbf{a}^{(i)} $$

其中：
- $\mathbf{a}^{(i)} \in \mathbb{R}^{d_1}$ 是第 $i$ 个样本在该层的**输入激活值**（前向传播时已计算）
- $\mathbf{b}^{(i)} \in \mathbb{R}^{d_2}$ 是第 $i$ 个样本在该层的**输出梯度**（反向传播时已计算）

注意到：$\ell = \sum_{j=1}^B \ell^{(j)}$ 是 batch 内损失的和，**对 $\ell$ 做反向传播时，每个样本 $\ell^{(i)}$ 对 $\mathbf{s}^{(i)}$ 的偏导等于总损失对 $\mathbf{s}^{(i)}$ 的偏导**：

$$ \frac{\partial \ell^{(i)}}{\partial \mathbf{s}^{(i)}} = \frac{\partial \ell}{\partial \mathbf{s}^{(i)}} $$

这意味着 $(\mathbf{a}^{(i)}, \mathbf{b}^{(i)})$ 在一次 batch 前向+反向传播中**全部自然可得**，无需额外计算。

因此对于两个样本梯度点积可以这样计算：

$$
\begin{aligned}
\frac{\partial \ell^{(1)}}{\partial \mathbf{W}} \odot \frac{\partial \ell^{(2)}}{\partial \mathbf{W}}
&= (\mathbf{b}^{(1)} \otimes \mathbf{a}^{(1)}) \odot (\mathbf{b}^{(2)} \otimes \mathbf{a}^{(2)}) \\
&= ((\mathbf{a}^{(1)})^T \mathbf{a}^{(2)})((\mathbf{b}^{(1)})^T \mathbf{b}^{(2)})
\end{aligned}
$$

具体流程如下：

```
常规训练的一次迭代：
输入: batch = {z_1, ..., z_B}, 验证样本 z_val
--------------------------------------------------------------------------------
1. 前向传播：计算  L_total = ΣL(z_i) + L(z_val)
              └── 保存每层激活值 a^{(i)}（前向时自然得到）
              
2. 反向传播：计算  ∂L_total/∂w（用于参数更新）
              └── 保存每层输出梯度 b^{(i)}（反向时自然得到）
              
3. Ghost 计算：
   ┌────────────────────────────────────────────┐
   │  对每一层：                                 │
   │    for each z_i in batch:                  │
   │      dot_i = (a^{(i)}·a^{(val)})           │ ← 激活值内积
   │             × (b^{(i)}·b^{(val)})           │ ← 输出梯度内积
   │                                             │
   │  φ_i = -η_t × Σ_layers dot_i               │ ← 对全模型加和
   └────────────────────────────────────────────┘
   
4. 参数更新：w ← w - η_t · ∂L_total/∂w
--------------------------------------------------------------------------------
输出: 每个样本的 Shapley 分数 φ_i, 更新后的参数 w_{t+1}
```

### 二阶近似 及 高效计算

$$
\phi_z(U^{(t)}) = \phi_z(U_1) + \frac{1}{2}\phi_z(U_2) = -\eta_t \nabla\ell(w_t, z^{\text{val}}) \cdot \nabla\ell(w_t, z) + \frac{\eta_t^2}{2} \nabla\ell(w_t, z)^T H_t \left(\sum_{z_j \in \text{batch}} \nabla\ell(w_t, z_j)\right)
$$

一阶项已经证明；对于二阶项证明如下：

记 $x_j := \nabla\ell(w_t, z_j)$，$\tilde{x} := \nabla\ell(w_t, z)$，$H := H_t$。

则 $U_2(S) = \eta_t^2 \left(\sum_{z_j \in S} x_j\right)^T H \left(\sum_{z_j \in S} x_j\right)$。

**(a)** 先求边际贡献。对任意 $S \subseteq \text{batch} \setminus \{z\}$：

$$
\begin{aligned}
U_2(S\cup\{z\}) - U_2(S) &= \eta_t^2 \left(\tilde{x} + \sum_{j\in S} x_j\right)^T H \left(\tilde{x} + \sum_{j\in S} x_j\right) - \eta_t^2 \left(\sum_{j\in S} x_j\right)^T H \left(\sum_{j\in S} x_j\right) \\
&= \eta_t^2 \left( 2\tilde{x}^T H \left(\sum_{j\in S} x_j\right) + \tilde{x}^T H \tilde{x} \right)
\end{aligned}
$$

这里展开时注意 $\left(\sum_{S} x_j\right)^T H \tilde{x} = \tilde{x}^T H \left(\sum_{S} x_j\right)$ （标量的转置等于自身），所以交叉项合并为 $2\tilde{x}^T H \sum_{S} x_j$。

**(b)** 代入 Shapley 值定义。令 $n = |\text{batch}|$：

$$
\phi_z(U_2) = \eta_t^2 \cdot \frac{1}{n} \sum_{k=1}^n \binom{n-1}{k-1}^{-1} \sum_{S \subseteq \text{batch}\setminus\{z\}, |S|=k-1} \left[ 2\tilde{x}^T H \sum_{j\in S} x_j + \tilde{x}^T H \tilde{x} \right]
$$

把常数项 $\tilde{x}^T H \tilde{x}$ 提出来。对任意 $k$，大小为 $k-1$ 的子集 $S$ 的数量是 $\binom{n-1}{k-1}$，所以：

$$
\frac{1}{n} \sum_{k=1}^n \binom{n-1}{k-1}^{-1} \binom{n-1}{k-1} \tilde{x}^T H \tilde{x} = \frac{1}{n} \sum_{k=1}^n \tilde{x}^T H \tilde{x} = \tilde{x}^T H \tilde{x}
$$

对于含 $\sum_{S} x_j$ 的项，关键步骤是利用对称性：每个 $z_j (j \neq z)$ 出现在所有 $S$ 中的次数是相同的。大小为 $k-1$ 且包含特定 $z_j$ 的子集 $S$ 的数量是 $\binom{n-2}{k-2}$（从除 $z$ 和 $z_j$ 外的 $n-2$ 个中选 $k-2$ 个）。因此：

$$
\begin{aligned}
&\frac{1}{n} \sum_{k=1}^n \binom{n-1}{k-1}^{-1} \sum_{S, |S|=k-1} 2\tilde{x}^T H \sum_{j\in S} x_j \\
&= \frac{2}{n} \sum_{k=2}^n \binom{n-1}{k-1}^{-1} \binom{n-2}{k-2} \tilde{x}^T H \left(\sum_{z_j \in \text{batch}\setminus\{z\}} x_j\right) \\
&= \frac{2}{n} \sum_{k=2}^n \frac{k-1}{n-1} \cdot \tilde{x}^T H \left(\sum_{z_j \in \text{batch}\setminus\{z\}} x_j\right) \\
&= \tilde{x}^T H \left(\sum_{z_j \in \text{batch}\setminus\{z\}} x_j\right)
\end{aligned}
$$

其中 $\binom{n-2}{k-2}/\binom{n-1}{k-1} = \frac{k-1}{n-1}$（组合数化简），而 $\frac{2}{n}\sum_{k=2}^n \frac{k-1}{n-1} = \frac{2}{n} \cdot \frac{n(n-1)}{2(n-1)} = 1$（等差数列求和）。

**(c)** 合并两项得到：

$$
\phi_z(U_2) = \eta_t^2 \left( \tilde{x}^T H \tilde{x} + \tilde{x}^T H \left(\sum_{z_j \in \text{batch}\setminus\{z\}} x_j\right) \right) = \eta_t^2 \tilde{x}^T H \left(\sum_{z_j \in \text{batch}} x_j\right)
$$

#### 高效计算

我没看懂，记录如下

二阶项需要计算梯度-Hessian-梯度乘积：

$$ \phi_z(U_2) = \eta_t^2 \cdot \nabla\ell(z)^T \cdot H \cdot \left(\sum_{z_j \in \text{batch}} \nabla\ell(z_j)\right) $$

通过$H \cdot v = \nabla(\nabla L \cdot v)$，将 $H$ 与 $v$ 的乘积转化为"先算一个标量，再对这个标量求梯度"。

具体流程：

**第一次反向传播**（与一阶共享，1 次 backprop）：

$$
\text{对 } \sum_{z \in \text{batch}} \ell(z) + \ell(z^{\text{val}}) \text{ 做反向传播}
$$

得到所有样本在各层的激活值 $\mathbf{a}_l^{(i)}$ 和输出梯度 $\mathbf{b}_l^{(i)}$。

**构造标量 $s$（用 Ghost Dot-Product 计算，无需构造向量）：**

$$ s = \nabla\ell(z^{\text{val}}) \cdot \left(\sum_{j} \nabla\ell(z_j)\right) = \sum_l ((\mathbf{a}_l^{\text{val}})^T \sum_j \mathbf{a}_l^{(j)}) \; ((\mathbf{b}_l^{\text{val}})^T \sum_j \mathbf{b}_l^{(j)}) $$

**第二次反向传播**（1 次额外 backprop）：

$$ h := \frac{\partial s}{\partial w} = H \cdot \left(\sum_j \nabla\ell(z_j)\right) $$

反向传播自动计算出这个 Hessian-向量积，全程不构造 Hessian 矩阵。

**对每个样本用 Ghost Dot-Product 算 $\phi_z(U_2)$：**

$$ \phi_{z_i}(U_2) = \eta_t^2 \cdot \nabla\ell(z_i) \cdot h $$

同样用 Ghost 公式逐层计算：

$$ \nabla\ell(z_i) \cdot h = \sum_l ((\mathbf{a}_l^{(i)})^T \mathbf{h}_l^a) \; ((\mathbf{b}_l^{(i)})^T \mathbf{h}_l^b) $$

其中 $\mathbf{h}_l^a, \mathbf{h}_l^b$ 是 $h$ 按层的分解。

### 局限性

- 验证数据必须在训练前可用
- 二阶改进幅度有限
- 只能用于SDG优化器，因为 Adam 的参数更新不是梯度的线性函数


### 应用

**数据清洗**：一次训练后排序移除 Shapley 值最低的样本

**数据配比**：

Shapley 值衡量的是"贡献"而非"难度"，需要注意**高 Shapley 值的样本往往是"难但有价值"的样本，而不是"简单"样本。**，同时样本在模型训练的不同阶段会贡献会不同。

一些思路：

追踪每个样本的 Shapley 值随训练步数的变化：

- **早期高、后期低** → 已学会的基础样本
- **逐渐从负转正** → "可教"的样本，适合在当前阶段加入
- **始终为负** → 问题数据，排除
- **后期才变高** → 适合后期加入的"进阶"样本
