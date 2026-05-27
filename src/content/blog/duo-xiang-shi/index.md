---
title: MATLAB中多项式详解
publishDate: 2022-06-01
description: 'MATLAB中多项式详解'
tags:
  - matlab
language: '中文'
ai: ai
---

**_MATLAB表示多项式为包含由下降幂排列的系数的行向量。_**

## 计算多项式的值

`polyval()`函数
**eg:**

```python
p = [1 7 0 -5 9];
polyval(p,4)
```

`polyvalm()`函数用于评估计算矩阵多项式
**eg:**

```python
p = [1 7 0 -5 9];
X = [1 2 -3 4; 2 -5 6 3; 3 1 0 2; 5 -7 3 8];
polyvalm(p, X)
```

## 计算多项式的根

`roots`函数计算多项式的根。 例如，要计算多项式`p`的根，可参考以下语法 -

```matlab
p = [1 7 0  -5 9];
r = roots(p)
```

`poly`函数是`roots`函数的逆，并返回到多项式系数。 例如 -

```matlab
p = [1 7 0  -5 9];
r = roots(p)
p2 = poly(r)
```

MATLAB执行上述代码语句返回以下结果 -

```shell
Trial>> p = [1 7 0  -5 9];
r = roots(p)
p2 = poly(r)

r =

  -6.8661 + 0.0000i
  -1.4247 + 0.0000i
   0.6454 + 0.7095i
   0.6454 - 0.7095i


p2 =

    1.0000    7.0000    0.0000   -5.0000    9.0000
```

## 多项式曲线拟合

`polyfit`函数用来查找一个多项式的系数，它符合最小二乘法中的一组数据。 如果`x`和`y`包含要拟合到`n`度多项式的`x`和`y`数据的两个向量，则得到通过拟合数据的多项式，参考代码 -

```matlab
p = polyfit(x,y,n)
```

**示例**

创建脚本文件并键入以下代码 -

```matlab
x = [1 2 3 4 5 6]; y = [5.5 43.1 128 290.7 498.4 978.67];  %data
p = polyfit(x,y,4)   %get the polynomial
% Compute the values of the polyfit estimate over a finer range,
% and plot the estimate over the real data values for comparison:
x2 = 1:.1:6;
y2 = polyval(p,x2);
plot(x,y,'o',x2,y2)
grid on
```

MATLAB执行上述代码语句返回以下结果 -

```shell
Trial>> x = [1 2 3 4 5 6]; y = [5.5 43.1 128 290.7 498.4 978.67];  %data
p = polyfit(x,y,4)   %get the polynomial
% Compute the values of the polyfit estimate over a finer range,
% and plot the estimate over the real data values for comparison:
x2 = 1:.1:6;
y2 = polyval(p,x2);
plot(x,y,'o',x2,y2)
grid on

p =

    4.1056  -47.9607  222.2598 -362.7453  191.1250
```

同时还输出一个图形 -

![](http://www.yiibai.com/uploads/images/201710/0810/631081057_19222.png)
