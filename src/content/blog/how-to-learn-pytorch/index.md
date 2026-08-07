---
title: 基于Pytorch的深度学习入门教程
description: 从数据与模型入手，循序渐进讲解 PyTorch 深度学习入门所需的 Dataset、DataLoader 等核心概念。
publishDate: '2024-12-06'
tags:
- deep learning
- pytorch
- 教程
draft: false
language: Chinese
comment: true
ai: human
---

# 基于Pytorch的深度学习入门教程

私以为深度学习入门主要是 **数据**+**模型**，因此本教程从数据入手，逐步深入

<u>本教程需要一定的基础，不是对内容的详细讲解，更偏重于引导入门。详细内容参见</u>​[PyTorch documentation](https://pytorch.org/docs/stable/index.html)

### 关于分析python包内容及作用

​`dir()`​ 获取包中的所有功能

​`help()`​帮助文档

‍

## Dataset和DataLoader

[两文读懂PyTorch中Dataset与DataLoader（一）打造自己的数据集 - 知乎](https://zhuanlan.zhihu.com/p/105507334)

[两文读懂PyTorch中Dataset与DataLoader（二）理解DataLoader源码 - 知乎](https://zhuanlan.zhihu.com/p/105578087)

简单来说，`Dataset`​只需要重写

```python
def __getitem__(self, index) -> tuple(x, label):
```

以及

```python
 def __len__(self) -> int:
```

Like this

```python
class CustomDataset(data.Dataset):#需要继承data.Dataset
    def __init__(self):
        # TODO
        # 1. Initialize file path or list of file names.
        pass
    def __getitem__(self, index):
        # TODO
        # 1. Read one data from file (e.g. using numpy.fromfile, PIL.Image.open).
        # 2. Preprocess the data (e.g. torchvision.Transform).
        # 3. Return a data pair (e.g. image and label).
        #这里需要注意的是，第一步：read one data，是一个data
        pass
    def __len__(self):
        # You should change 0 to the total size of your dataset.
        return 0
```

即可传递给`DataLoader`​

```python
dataloader = DataLoader(dataset, batch_size=1, shuffle=False, sampler=None,
           batch_sampler=None, num_workers=0, collate_fn=None,
           pin_memory=False, drop_last=False, timeout=0,
           worker_init_fn=None)

# batch_size 一次取出的数据个数
# shuffle 是否打乱数据
# num_workers 加载数据的线程
# drop_last 是否丢弃剩余的数据，例如一共100个数据，每次batch取3，是否将剩余的1丢取

for data_batch in dataloader:
	xs, labels = data_batch
```

‍

### 关于`epoch`​和`batch`​

一个`epoch`​即把所有数据训练一轮

​`batch`​是把一个数据集中多个数据整合成一个`batch`​，并行训练。

‍

## Tensorboard

**记录**训练日志的工具，例如训练过程中`loss`​的变化，训练到某一步的网络输出等

常用的有`SummaryWriter`​, `FileWriter`​, 以及`RecordWriter`​

‍

#### `SummaryWriter`​

导入及使用

```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("logs") #指定文件夹
# writer = SummaryWriter() # 不指定默认./runs

writer.add_scalar(...)
writer.add_image(...)
writer.close()

```

‍

1. ​`add_scalar`​添加一个标量值

```python
    def add_scalar(
        self,
        tag, # 标题
        scalar_value, # y轴值
        global_step=None, # x轴值
        walltime=None,
        new_style=False,
        double_precision=False,
    ):
        """Add scalar data to summary.

        Args:
            tag (str): Data identifier
            scalar_value (float or string/blobname): Value to save
            global_step (int): Global step value to record
            walltime (float): Optional override default walltime (time.time())
              with seconds after epoch of event
            new_style (boolean): Whether to use new style (tensor field) or old
              style (simple_value field). New style could lead to faster data loading.
        Examples::

            from torch.utils.tensorboard import SummaryWriter
            writer = SummaryWriter()
            x = range(100)
            for i in x:
                writer.add_scalar('y=2x', i * 2, i)
            writer.close()

        Expected result:

        .. image:: _static/img/tensorboard/add_scalar.png
           :scale: 50 %

        """
```

‍

2. ​`add_image`​

注意输入图像的格式，以及图像的`shape`​

> Shape:  
>             img_tensor: Default is :math:`(3, H, W)`​. You can use `torchvision.utils.make_grid()`​ to  
>             convert a batch of tensor into 3xHxW format or call `add_images`​ and let us do the job.  
>             Tensor with :math:`(1, H, W)`​, :math:`(H, W)`​, :math:`(H, W, 3)`​ is also suitable as long as  
>             corresponding `dataformats`​ argument is passed, e.g. `CHW`​, `HWC`​, `HW`​.

```python
    def add_image(
        self, tag, img_tensor, global_step=None, walltime=None, dataformats="CHW"
    ):
        """Add image data to summary.

        Note that this requires the ``pillow`` package.

        Args:
            tag (str): Data identifier
            img_tensor (torch.Tensor, numpy.ndarray, or string/blobname): Image data
            global_step (int): Global step value to record
            walltime (float): Optional override default walltime (time.time())
              seconds after epoch of event
            dataformats (str): Image data format specification of the form
              CHW, HWC, HW, WH, etc.
        Shape:
            img_tensor: Default is :math:`(3, H, W)`. You can use ``torchvision.utils.make_grid()`` to
            convert a batch of tensor into 3xHxW format or call ``add_images`` and let us do the job.
            Tensor with :math:`(1, H, W)`, :math:`(H, W)`, :math:`(H, W, 3)` is also suitable as long as
            corresponding ``dataformats`` argument is passed, e.g. ``CHW``, ``HWC``, ``HW``.

        Examples::

            from torch.utils.tensorboard import SummaryWriter
            import numpy as np
            img = np.zeros((3, 100, 100))
            img[0] = np.arange(0, 10000).reshape(100, 100) / 10000
            img[1] = 1 - np.arange(0, 10000).reshape(100, 100) / 10000

            img_HWC = np.zeros((100, 100, 3))
            img_HWC[:, :, 0] = np.arange(0, 10000).reshape(100, 100) / 10000
            img_HWC[:, :, 1] = 1 - np.arange(0, 10000).reshape(100, 100) / 10000

            writer = SummaryWriter()
            writer.add_image('my_image', img, 0)

            # If you have non-default dimension setting, set the dataformats argument.
            writer.add_image('my_image_HWC', img_HWC, 0, dataformats='HWC')
            writer.close()

        Expected result:

        .. image:: _static/img/tensorboard/add_image.png
           :scale: 50 %

        """
```

以及`add_images`​, `add_scalars`​，`qdd_graph`​...

‍

## Transform

用于格式转换，缩放等等的工具，有`torchvision.transforms.v2`​和`torchvision.transforms`​

关于他们的不同及使用建议

> ## V1 or V2? Which one should I use?
>
> **TL;DR** We recommending using the `torchvision.transforms.v2`​ transforms instead of those in `torchvision.transforms`​. They’re faster and they can do more things. Just change the import and you should be good to go. Moving forward, **new features and improvements will only be considered for the v2 transforms**.

```python
from torchvision.transforms import  v2 as transforms # better
# from torchvision import  transforms
```

文档

 [Transforming and augmenting images — v2](https://pytorch.org/vision/stable/transforms.html#v2-api-reference-recommended)

 [Transforming and augmenting images — v1](https://pytorch.org/vision/stable/transforms.html#v1-api-reference)

‍

注意：为了支持`torchscript`​，`v2.ToTensor()`​已经**DEPRECATED，需要换成**

```python
ToTensor = v2.Compose([v2.ToImage(), v2.ToDtype(torch.float32, scale=True)])
```

‍

## 网络搭建

### `torch.nn`​及`torch.nn.functional`​

[torch.nn — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/nn.html#module-torch.nn)

[torch.nn.functional — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/nn.functional.html)

‍

​`torch.nn`​中包含了关于搭建网络所需的层或者`blocks`​（各种`Layers`​，损失函数等等），`torch.nn.functional`​是一个函数库

> These are the basic building blocks for graphs

​`torch.nn`​包含模型的参数（weights, biases 等）作为其属性，其中的卷积核参数会随着模型的训练不断更新。

​`torch.nn.functional`​偏重计算，其中没有包含模型的参数信息。

​`torch.nn`​中比较重要的是

1. `torch.nn.Module`​

> Base class for all neural network modules.
>
> Your models should also subclass this class.

```python
import torch.nn as nn
import torch.nn.functional as F

class Model(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.conv1 = nn.Conv2d(1, 20, 5)
        self.conv2 = nn.Conv2d(20, 20, 5)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        return F.relu(self.conv2(x))
```

2. ​`torch.nn.Sequential`​

> A sequential container.
>
> Modules will be added to it in the order they are passed in the constructor. Alternatively, an `OrderedDict`​ of modules can be passed in. The `forward()`​ method of `Sequential`​ accepts any input and forwards it to the first module it contains. It then “chains” outputs to inputs sequentially for each subsequent module, finally returning the output of the last module.

即将多个层结合成一个层

```python
# Using Sequential to create a small model. When `model` is run,
# input will first be passed to `Conv2d(1,20,5)`. The output of
# `Conv2d(1,20,5)` will be used as the input to the first
# `ReLU`; the output of the first `ReLU` will become the input
# for `Conv2d(20,64,5)`. Finally, the output of
# `Conv2d(20,64,5)` will be used as input to the second `ReLU`
model = nn.Sequential(
          nn.Conv2d(1,20,5),
          nn.ReLU(),
          nn.Conv2d(20,64,5),
          nn.ReLU()
        )

# Using Sequential with OrderedDict. This is functionally the
# same as the above code
model = nn.Sequential(OrderedDict([
          ('conv1', nn.Conv2d(1,20,5)),
          ('relu1', nn.ReLU()),
          ('conv2', nn.Conv2d(20,64,5)),
          ('relu2', nn.ReLU())
        ]))
```

关于更加详细的各个层详见官方文档

### 使用及修改现有网络模型

​`torchvision`​、`torchtext`​、`torchaudio`​等提供了许多现有的网络模型

[Models and pre-trained weights — Torchvision 0.20 documentation](https://pytorch.org/vision/stable/models.html#classification)

以`Alexnet`​为例

```python
from torchvision.models import alexnet
model = alexnet() # 不初始化参数
# model = alexnet(weights = AlexNet_Weights.DEFAULT) # 可以通过weights指定现有模型参数
print(model)
```

```python
AlexNet(
  (features): Sequential(
    (0): Conv2d(3, 64, kernel_size=(11, 11), stride=(4, 4), padding=(2, 2))
    (1): ReLU(inplace=True)
    (2): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
    (3): Conv2d(64, 192, kernel_size=(5, 5), stride=(1, 1), padding=(2, 2))
    (4): ReLU(inplace=True)
    (5): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
    (6): Conv2d(192, 384, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (7): ReLU(inplace=True)
    (8): Conv2d(384, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (9): ReLU(inplace=True)
    (10): Conv2d(256, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (11): ReLU(inplace=True)
    (12): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
  )
  (avgpool): AdaptiveAvgPool2d(output_size=(6, 6))
  (classifier): Sequential(
    (0): Dropout(p=0.5, inplace=False)
    (1): Linear(in_features=9216, out_features=4096, bias=True)
    (2): ReLU(inplace=True)
    (3): Dropout(p=0.5, inplace=False)
    (4): Linear(in_features=4096, out_features=4096, bias=True)
    (5): ReLU(inplace=True)
    (6): Linear(in_features=4096, out_features=1000, bias=True)
  )
)
```

修改模型

```python
model.add_module('new_fc', torch.nn.Linear(1000, 10)) #添加模型
# model.classifier.add_module('new_fc', torch.nn.Linear(1000, 10)) # 对模型中的classifier子模块添加Layer

model.classifier[6] = torch.nn.Linear(4096, 10) # 对classifier中第六个部分进行替换
```

‍

## 误差及反向传播

### 损失函数

[torch.nn — loss-functions](https://pytorch.org/docs/stable/nn.html#loss-functions)

损失函数当作当前训练的反馈，进行为反向传播提供参数更新的依据

反向传播只用于计算梯度等，参数更新需要用到优化器

‍

### 优化器`optim`​

[torch.optim — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/optim.html)

各种模型的训练算法，根据`loss`​更新模型参数

因此初始时需要传入模型参数

```python
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
optimizer = optim.Adam([var1, var2], lr=0.0001)
```

注意训练过程中需要将之前的梯度清零防止影响

```python
for input, target in dataset:
    optimizer.zero_grad() # 梯度清零
    output = model(input)
    loss = loss_fn(output, target)
    loss.backward() 
    optimizer.step()
```

## 模型的保存和读取

[saving-and-loading-torch-nn-modules — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/notes/serialization.html#saving-and-loading-torch-nn-modules)

[Saving and Loading Models — PyTorch Tutorials 2.5.0+cu124 documentation](https://pytorch.org/tutorials/beginner/saving_loading_models.html)

‍

### 1. Save/Load `state_dict`​ (Recommended)

**Save:**

```python
torch.save(model.state_dict(), PATH)
```

**Load:**

```python
model = TheModelClass(*args, **kwargs)
model.load_state_dict(torch.load(PATH, weights_only=True))
model.eval()
```

> 注意
>
> The 1.6 release of PyTorch switched `torch.save`​ to use a new zip file-based format. `torch.load`​ still retains the ability to load files in the old format. If for any reason you want `torch.save`​ to use the old format, pass the `kwarg`​ parameter `_use_new_zipfile_serialization=False`​.

‍

### Save/Load Entire Model

**Save:**

```
torch.save(model, PATH)
```

**Load:**

```
# Model class must be defined somewhere 注意模型必须事先定义
model = torch.load(PATH, weights_only=False)
model.eval()
```

‍

> 注意
>
> Remember that you must call `model.eval()`​ to set dropout and batch normalization layers to evaluation mode before running inference. Failing to do this will yield inconsistent inference results.

即记得使用模型前调用`model.eval()`​，否则将会使用训练模式，这样的话原本为了防止过拟合的`dropout`​层等仍生效。

‍

## GPU训练

1. ​`.cuda()`​

训练时，对模型、损失函数、标签，及数据进行`.cuda()`​将数据使用`GPU`​	进行训练。

2. ​`to(device)`​

[torch.device — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/tensor_attributes.html#torch.device)

先定义`device`​

> A [`torch.device`](https://pytorch.org/docs/stable/tensor_attributes.html#torch.device "torch.device")​ is an object representing the device on which a [`torch.Tensor`](https://pytorch.org/docs/stable/tensors.html#torch.Tensor "torch.Tensor")​ is or will be allocated.

‍

```python
device = torch.device('cuda:0')
device = torch.device('cpu')
device = torch.device('mps')
device  = torch.device('cuda')  # current cuda device

label.to(device)
model.to(device)
# ....
```