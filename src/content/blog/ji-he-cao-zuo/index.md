---
title: MATLAB中集合操作
publishDate: 2022-06-03
description: 'MATLAB中集合操作函数'
tags:
  - matlab
language: '中文'
---

函数

描述

intersect(A,B)

设置两个数组的交集；返回A和B所共有的值。返回的值按排序顺序排列。

intersect(A,B,'rows')

将A和B的每一行作为单个实体处理，并返回A和B的公共行。返回的矩阵的行按排序顺序排列。

ismember(A,B)

返回与A大小相同的数组，包含1（true），其中A的元素在其他地方的B中找到，它返回0（false）。

ismember(A,B,'rows')

将A和B的每一行作为单个实体处理，并返回一个包含1（true）的向量，其中矩阵A的行也是B的行；否则，它返回0（false）。

issorted(A)

如果A的元素按排序顺序返回逻辑1（true），否则返回逻辑0（false）。输入A可以是向量，也可以是N-by-1或1-by-N的字符串数组。如果A和sort（A）的输出相等，则A被认为是排序的。

issorted(A, 'rows')

如果二维矩阵A的行按排序顺序返回逻辑1（真），否则返回逻辑0（假）。 如果A和排序（A）的输出相等，则认为矩阵A被排序。

setdiff(A,B)

设置两个数组的差值；返回不在B中的值。返回数组中的值按排序顺序排列。

setdiff(A,B,'rows')

将每一行A和B行作为单个实体处理，并返回一个不在B中的行。返回的矩阵的行按排序顺序排列。

“行”选项不支持单元格数组。

setxor

设置两个数组的异或

union

设置两个数组的并集

unique

数组中唯一的值
