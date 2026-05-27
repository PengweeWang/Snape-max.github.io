---
title: 使用PyQt5开发应用程序总结
publishDate: 2023-08-11
description: 'PyQt5 是一个用于创建图形用户界面的 Python 框架'
tags:
  - pyqt5
  - gui
language: '中文'
ai: ai
---

# PyQt5 使用笔记

PyQt5 是一个用于创建图形用户界面(GUI)的 Python 框架，基于 Qt 库开发而来。它提供了丰富的工具和组件，使开发者能够轻松地创建各种强大的桌面应用程序。本文将介绍 PyQt5 的基本用法，并提供一些示例代码帮助你入门。

## 安装 PyQt5

首先，需要安装 PyQt5 模块。你可以使用 pip 命令来安装：

```bash
pip install PyQt5
```

## 创建一个基本的 PyQt5 窗口

在 PyQt5 中，你可以通过两种方法来创建窗口：

1. **面向对象编程：** 这种方法涉及创建一个继承自特定窗口类的新类，并在新类中重写需要的方法来配置界面和处理事件。这种方法更加面向对象，可以更好地组织和管理代码。

2. **直接编写代码：** 这种方法涉及直接编写代码来创建窗口和组件，然后配置属性和信号槽等。这种方法更加直接，适用于一些简单的界面或快速原型开发。

下面分别展示了这两种方法的示例：

### 面向对象编程

```python
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("My Window")

        self.button = QPushButton("Click me", self)
        self.button.setGeometry(50, 50, 100, 30)
        self.button.clicked.connect(self.on_button_click)

    def on_button_click(self):
        print("Button clicked")

app = QApplication(sys.argv)
window = MyWindow()
window.show()
sys.exit(app.exec_())
```

### 直接编写代码

```python
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton

app = QApplication(sys.argv)
window = QMainWindow()
window.setWindowTitle("My Window")

button = QPushButton("Click me", window)
button.setGeometry(50, 50, 100, 30)
button.clicked.connect(lambda: print("Button clicked"))

window.show()
sys.exit(app.exec_())
```

无论你选择哪种方法，都可以根据项目需求来灵活调整和扩展代码。如果界面较为复杂或需要更好的代码组织，建议使用面向对象编程。如果界面简单且直接，可以选择直接编写代码。

以下是一个使用面向对象编程简单的示例代码，展示了如何创建一个基本的 PyQt5 窗口：

```python
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("My PyQt5 Window")
        self.setGeometry(100, 100, 800, 600)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MyWindow()
    window.show()
    sys.exit(app.exec_())
```

在这个示例中，我们首先导入了必要的模块，然后创建了一个继承自 `QMainWindow` 的自定义窗口类 `MyWindow`。在 `__init__` 构造函数中，我们设置了窗口的标题和初始大小。最后，我们创建了一个应用对象并显示窗口。

## 常用的 PyQt5 组件

当使用 PyQt5 创建图形用户界面时，会涉及多种常用的组件，每个组件都有其特定的属性和用法。以下是一些常用组件的用法：

### QLabel（标签）

标签用于显示文本或图像，可以用来展示信息、标题、说明等。常用属性和方法包括：

- `setText(text)`：设置标签的文本内容。
- `text()`：获取标签的文本内容。
- `setPixmap(pixmap)`：设置标签显示的图像。
- `setAlignment(alignment)`：设置文本对齐方式。
- `setFont(font)`：设置字体。

```python
from PyQt5.QtWidgets import QLabel

label = QLabel("Hello, PyQt5")
label.setAlignment(Qt.AlignCenter)
label.setFont(QFont("Arial", 12, QFont.Bold))
```

### QLineEdit（单行文本输入框）

单行文本输入框用于接收用户输入的文本，例如用户名、密码等。常用属性和方法包括：

- `setText(text)`：设置文本框的初始文本。
- `text()`：获取用户输入的文本内容。
- `setPlaceholderText(text)`：设置提示文本。

```python
from PyQt5.QtWidgets import QLineEdit

line_edit = QLineEdit()
line_edit.setPlaceholderText("Enter your name")
```

### QTextEdit（多行文本输入框）

多行文本输入框用于接收多行文本输入，支持富文本格式。常用属性和方法包括：

- `setText(text)`：设置文本框的初始文本。
- `toPlainText()`：获取用户输入的纯文本内容。
- `insertHtml(html)`：插入富文本内容。

```python
from PyQt5.QtWidgets import QTextEdit

text_edit = QTextEdit()
text_edit.insertHtml("<b>Hello</b>, <i>PyQt5</i>")
```

### QComboBox（下拉框）

下拉框提供了一组选项供用户选择。常用属性和方法包括：

- `addItem(item)`：添加选项。
- `addItems(items)`：批量添加选项。
- `currentIndex()`：获取当前选中的选项索引。
- `currentText()`：获取当前选中的选项文本。
- `activated.connect(slot)`：连接选项激活的信号。

```python
from PyQt5.QtWidgets import QComboBox

combo_box = QComboBox()
combo_box.addItem("Option 1")
combo_box.addItems(["Option 2", "Option 3"])
selected_index = combo_box.currentIndex()
selected_text = combo_box.currentText()
combo_box.activated.connect(on_combo_box_activated)
```

### QPushButton（按钮）

按钮用于触发特定操作或事件。常用属性和方法包括：

- `setText(text)`：设置按钮显示的文本。
- `clicked.connect(slot)`：连接按钮点击事件的信号。

```python
from PyQt5.QtWidgets import QPushButton

button = QPushButton("Click me")
button.clicked.connect(on_button_click)
```

### QCheckBox（复选框）

复选框用于表示一个二选一的选项。常用属性和方法包括：

- `isChecked()`：检查复选框是否被选中。
- `text()`：获取复选框的文本内容。
- `toggled.connect(slot)`：连接复选框状态变化的信号。

```python
from PyQt5.QtWidgets import QCheckBox

check_box = QCheckBox("Check me")
checked = check_box.isChecked()
check_box.toggled.connect(on_check_box_toggled)
```

### QRadioButton（单选按钮）

单选按钮用于从多个选项中选择一个。常用属性和方法包括：

- `isChecked()`：检查单选按钮是否被选中。
- `text()`：获取单选按钮的文本内容。
- `toggled.connect(slot)`：连接单选按钮状态变化的信号。

```python
from PyQt5.QtWidgets import QRadioButton

radio_button = QRadioButton("Option 1")
checked = radio_button.isChecked()
radio_button.toggled.connect(on_radio_button_toggled)
```

### QSlider（滑块）

滑块用于选择一个范围内的值。常用属性和方法包括：

- `setRange(minimum, maximum)`：设置滑块的范围。
- `setValue(value)`：设置滑块的当前值。
- `value()`：获取滑块的当前值。
- `sliderMoved.connect(slot)`：连接滑块移动事件的信号。

```python
from PyQt5.QtWidgets import QSlider

slider = QSlider(Qt.Horizontal)
slider.setRange(0, 100)
slider.setValue(50)
slider.sliderMoved.connect(on_slider_moved)
```

### QProgressBar（进度条）

进度条用于显示任务的进度。常用属性和方法包括：

- `setRange(minimum, maximum)`：设置进度条的范围。
- `setValue(value)`：设置进度条的当前值。
- `value()`：获取进度条的当前值。

```python
from PyQt5.QtWidgets import QProgressBar

progress_bar = QProgressBar()
progress_bar.setRange(0, 100)
progress_bar.setValue(75)
```

### QSpinBox（数值输入框）

数值输入框用于输入整数值。常用属性和方法包括：

- `setRange(minimum, maximum)`：设置数值输入框的范围。
- `setValue(value)`：设置数值输入框的当前值。
- `value()`：获取数值输入框的当前值。

```python
from PyQt5.QtWidgets import QSpinBox

spin_box = QSpinBox()
spin_box.setRange(0, 100)
spin_box.setValue(50)
```

### QDateTimeEdit（日期时间输入框）

日期时间输入框用于输入日期和时间。常用属性和方法包括：

- `setDateTime(datetime)`：设置日期时间输入框的日期时间。
- `dateTime()`：获取日期时间输入框的日期时间。

```python
from PyQt5.QtWidgets import QDateTimeEdit

date_time_edit = QDateTimeEdit()
date_time_edit.setDateTime(QDateTime.currentDateTime())
```

### QFileDialog（文件对话框）

文件对话框用于选择文件或目录。常用方法包括：

- `getOpenFileName()`：打开文件选择对话框并返回选择的文件路径。
- `getSaveFileName()`：打开文件保存对话框并返回选择的文件路径。
- `getExistingDirectory()`：打开目录选择对话框并返回选择的目录路径。

```python
from PyQt5.QtWidgets import QFileDialog

file_path, _ = QFileDialog.getOpenFileName(None, "Open File", "", "All Files (*.*)")
```

### QMessageBox（消息框）

消息框用于显示提示、警告或错误信息。常用方法包括：

- `information(parent, title, text)`：显示信息提示框。
- `warning(parent, title, text)`：显示警告提示框。
- `critical(parent, title, text)`：显示错误提示框。
- `question(parent, title, text)`：显示询问提示框。

```python
from PyQt5.QtWidgets import QMessageBox

QMessageBox.information(None, "Info", "This is an information message.")
```

## 布局管理

在 PyQt5 中，布局管理用于自动排列和定位组件，以便适应不同窗口大小。以下是一些常用的布局类型和使用示例：

### QGridLayout（网格布局）

网格布局将组件按照行和列的方式排列。常用方法包括：

- `addWidget(widget, row, column, rowSpan, columnSpan)`：将组件添加到指定行列位置，可跨行列。

```python
from PyQt5.QtWidgets import QGridLayout

grid = QGridLayout()
grid.addWidget(label, 0, 0)
grid.addWidget(line_edit, 1, 0)
grid.addWidget(text_edit, 2, 0, 2, 1)
```

### QVBoxLayout（垂直布局）

垂直布局将组件按垂直方向排列。常用方法包括：

- `addWidget(widget)`：将组件按顺序添加到布局。

```python
from PyQt5.QtWidgets import QVBoxLayout

vbox = QVBoxLayout()
vbox.addWidget(button1)
vbox.addWidget(button2)
```

### QHBoxLayout（水平布局）

水平布局将组件按水平方向排列。常用方法包括：

- `addWidget(widget)`：将组件按顺序添加到布局。

```python
from PyQt5.QtWidgets import QHBoxLayout

hbox = QHBoxLayout()
hbox.addWidget(button1)
hbox.addWidget(button2)
```

这些是一些常用的 PyQt5 组件和布局，通过合理地使用它们，你可以创建出丰富多彩的图形用户界面。根据项目的需求，你可以灵活地选择合适的组件和布局方式。

布局管理使得窗口中的组件自动适应并排列，无需手动调整位置和大小。

## 多线程与线程间通信

### 创建线程

在 PyQt5 中，可以使用 `QThread` 类来创建线程。为了创建一个自定义线程，需要继承 `QThread` 并重写其 `run` 方法，将耗时操作放在 `run` 方法中执行。

```python
from PyQt5.QtCore import QThread

class MyThread(QThread):
    def run(self):
        # 耗时操作
        pass
```

### 在线程间传递信号

在多线程应用中，线程之间的通信是常见的需求。PyQt5 提供了信号与槽机制来实现线程间的通信。可以通过自定义信号，在一个线程中发射信号，然后在另一个线程中连接该信号到槽函数来接收信号。

```python
from PyQt5.QtCore import QThread, pyqtSignal

class MyThread(QThread):
    my_signal = pyqtSignal(str)  # 自定义信号，传递参数为 str 类型

    def run(self):
        # 耗时操作
        result = "耗时操作的结果"
        self.my_signal.emit(result)  # 发射信号
```

### 主线程接收信号

主线程可以连接自定义信号的槽函数，以接收在子线程中发射的信号。

```python
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.thread = MyThread()
        self.init_ui()

    def init_ui(self):
        # ... 初始化界面 ...

        self.thread.my_signal.connect(self.update_label)  # 连接信号和槽函数

    def update_label(self, result):
        # 更新界面
```

### 安全退出子线程

为了确保线程的安全退出，可以在窗口关闭事件中停止子线程并等待其完成。

```python
class MainWindow(QMainWindow):
    # ... 其他代码 ...

    def closeEvent(self, event):
        if self.thread.isRunning():
            self.thread.quit()  # 停止线程
            self.thread.wait()  # 等待线程完成
        event.accept()
```

### 进一步解释：

1.  `self.my_signal.emit(result)`：这行代码在子线程中发射了一个自定义信号 `my_signal`，并传递了参数 `result`。这个信号可以携带任意数量和类型的参数，这里我们传递了一个字符串 `result`。

2.  `self.thread.my_signal.connect(self.update_label)`：这行代码在主线程中连接了子线程发射的信号 `my_signal` 到主线程的槽函数 `update_label`。这样一旦子线程发射了信号，主线程就会调用 `update_label` 方法来处理这个信号。

3.  `def update_label(self, result):`：这是主线程中的槽函数。当子线程发射信号时，主线程会调用这个函数，并将子线程传递的参数 `result` 作为参数传递给这个函数。因此，`result` 确实代表了子线程传递的 `result`。

4.  关于`def update_label(self, result):` 中的参数名
    参数名只是一个标识符，它并不影响信号的传递和槽函数的调用。

        例如，你可以这样修改函数定义：

        ```python
        def update_label(self, data):
        # 使用 data 参数进行处理
        ```

        然后在连接信号时，也需要相应地修改：

        ```python
        self.thread.my_signal.connect(self.update_label)
        ```

        只要信号和槽函数的参数类型匹配，无论参数名是什么，信号传递的参数都能够被成功传递给槽函数进行处理。

### 关于传递参数的类型

在 PyQt5 中，你可以使用自定义信号来传递多种类型的参数。除了 `str` 类型，还可以传递以下常用的参数类型：

1. `int`：整数类型。
2. `float`：浮点数类型。
3. `bool`：布尔类型。
4. `list` 或 `tuple`：列表或元组类型，可以传递多个参数。
5. `object`：Python 对象，可以传递任意类型的参数。

需要注意的是，信号和槽函数的参数类型必须匹配，否则会引发错误。当然，你也可以使用 `pyqtSignal(object)` 来传递任意类型的参数，但在槽函数内部需要根据参数类型进行适当的处理。

以下是一个示例，展示了如何使用不同类型的参数传递自定义信号：

```python
from PyQt5.QtCore import pyqtSignal, QObject

class MyObject(QObject):
    my_signal_int = pyqtSignal(int)
    my_signal_float = pyqtSignal(float)
    my_signal_bool = pyqtSignal(bool)
    my_signal_list = pyqtSignal(list)
    my_signal_object = pyqtSignal(object)

    def send_signals(self):
        self.my_signal_int.emit(42)
        self.my_signal_float.emit(3.14)
        self.my_signal_bool.emit(True)
        self.my_signal_list.emit([1, 2, 3])
        self.my_signal_object.emit("Hello from signal!")

def my_slot(data):
    print("Received:", data)

obj = MyObject()
obj.my_signal_int.connect(my_slot)
obj.my_signal_float.connect(my_slot)
obj.my_signal_bool.connect(my_slot)
obj.my_signal_list.connect(my_slot)
obj.my_signal_object.connect(my_slot)

obj.send_signals()
```

在上述示例中，我们定义了一个 `MyObject` 类，它包含了不同类型的自定义信号。然后，我们通过连接这些信号到同一个槽函数 `my_slot` 来展示如何传递不同类型的参数。在槽函数内部，我们可以根据参数的类型来进行相应的处理。

### 多线程进阶

当涉及多线程编程和线程间通信时，以下是一些重要的概念和技术

1. **互斥锁和信号量**：

   互斥锁用于保护共享资源，以确保在任何时候只有一个线程可以访问资源。信号量用于限制同时访问资源的线程数量。

   ```python
   from PyQt5.QtCore import QMutex, QSemaphore, QThread

   class SharedResource:
       def __init__(self):
           self.mutex = QMutex()  # 创建互斥锁
           self.semaphore = QSemaphore(3)  # 创建信号量，允许3个线程同时访问

       def access_resource(self):
           self.semaphore.acquire()  # 获取信号量
           self.mutex.lock()  # 上锁
           # 访问和操作共享资源
           self.mutex.unlock()  # 解锁
           self.semaphore.release()  # 释放信号量

   class WorkerThread(QThread):
       def __init__(self, resource):
           super().__init__()
           self.resource = resource

       def run(self):
           self.resource.access_resource()

   resource = SharedResource()
   threads = [WorkerThread(resource) for _ in range(5)]

   for thread in threads:
       thread.start()
   ```

2. **线程池**：

   线程池可以有效地管理和调度多个线程执行任务，避免频繁地创建和销毁线程。

   ```python
   from PyQt5.QtCore import QThreadPool, QRunnable, Qt

   class Task(QRunnable):
       def __init__(self, task_id):
           super().__init__()
           self.task_id = task_id

       def run(self):
           print(f"Task {self.task_id} is running in thread {int(QThread.currentThreadId())}")

   pool = QThreadPool.globalInstance()

   for i in range(5):
       task = Task(i)
       pool.start(task)
   ```

3. **定时器和延迟**：

   使用定时器可以在一段时间后触发任务，避免阻塞线程。

   ```python
   from PyQt5.QtCore import QTimer, pyqtSlot

   class TimerExample:
       def __init__(self):
           self.timer = QTimer()
           self.timer.timeout.connect(self.on_timer_timeout)
           self.timer.start(1000)  # 每秒触发一次

       @pyqtSlot()
       def on_timer_timeout(self):
           print("Timer triggered")

   example = TimerExample()
   ```

4. **线程间通信的其他方式**：

   除了信号和槽函数，还可以使用队列来在线程之间传递数据。

   ```python
   import queue
   from PyQt5.QtCore import QThread, pyqtSlot

   class QueueExample(QThread):
       def __init__(self):
           super().__init__()
           self.message_queue = queue.Queue()

       def run(self):
           while True:
               message = self.message_queue.get()
               if message == "exit":
                   break
               print(f"Received message: {message}")

       def send_message(self, message):
           self.message_queue.put(message)

   example = QueueExample()
   example.start()
   example.send_message("Hello")
   example.send_message("World")
   example.send_message("exit")
   ```

## 总结

本文介绍了如何使用 PyQt5 创建常见的 GUI 组件，包括标签、按钮、文本框、下拉框、复选框和绘图区域，以及如何使用布局管理来排列这些组件。

## 应用

应用以上方法，笔者试着写了一个简易串口调试助手 [MA-SerialDebugger](https://github.com/Snape-max/MA-SerialDebugger/)，欢迎使用并提出改进意见。
