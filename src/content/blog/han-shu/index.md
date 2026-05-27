---
title: MATLAB中函数详解
publishDate: 2022-06-02
description: 'MATLAB中函数详解'
tags:
  - matlab
language: '中文'
---

_函数定义在单独的文件中，函数和函数的文件名应该是相同的。_

函数语句的语法是：

```sh
function [out1,out2, ..., outN] = myfun(in1,in2,in3, ..., inN)
```

`in1,in2...`是输入`out1,out2...`输出

eg:
下述有个 mymax 函数，它需要五个数字作为参数并返回最大的数字。

建立函数文件，命名为 mymax.m 并输入下面的代码：

```sh
function max = mymax(n1, n2, n3, n4, n5)
%This function calculates the maximum of the
% five numbers given as input
max =  n1;
if(n2 > max)
    max = n2;
end
if(n3 > max)
   max = n3;
end
if(n4 > max)
    max = n4;
end
if(n5 > max)
    max = n5;
end
```

## MATLAB匿名函数

一个匿名的函数就像是在传统的编程语言，在一个单一的 MATLAB 语句定义一个内联函数。

它由一个单一的 MATLAB 表达式和任意数量的输入和输出参数。

在MATLAB命令行或在一个函数或脚本可以定义一个匿名函数。

这种方式，可以创建简单的函数，而不必为他们创建一个文件。

建立一个匿名函数表达式的语法如下：

```sh
f = @(arglist)expression
```

## 详细例子

在这个例子中，我们将编写一个匿名函数 power，这将需要两个数字作为输入并返回第二个数字到第一个数字次幂。

在MATLAB中建立一个脚本文件，并输入下述代码：

```sh
power = @(x, n) x.^n;
result1 = power(7, 3)
result2 = power(49, 0.5)
result3 = power(10, -10)
result4 = power (4.5, 1.5)
```

运行该文件时，显示结果：

```sh
result1 =
   343
result2 =
     7
result3 =
   1.0000e-10
result4 =
    9.5459
```
