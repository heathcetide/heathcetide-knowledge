# 1 怎么将本地创建的项目初始化到GitLab
现在一般公司都使用GitLab作为代码管理工具,那么我们在本地创建的项目如何初始化到GitLab呢？
**1 在GitLab上创建一个项目和本地创建的名字相同**
这是一个新项目，也就是一个目录


<!-- 这是一张图片，ocr 内容为： -->
!


**2 在本地创建一个同名字的Maven项目**
在本地创建的Maven项目也叫:wanghang-springboot-depotstable


<!-- 这是一张图片，ocr 内容为： -->
!


**3 执行本地Git的操作**
 现在IDEA在创建Maven项目的时候,可以选择创建一个Git的仓库，因此，如果勾选了创建Git仓库的话，就不用再初始化本地的仓库的操作。

进入到项目所在的目录。
** 3.1 初始化本地仓库**
 初始化仓库
<font style="color:rgb(221, 74, 104);"> git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> init</font>


<!-- 这是一张图片，ocr 内容为： -->
!


<font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> 将本地项目代码的所有文件添加到暂存区 </font>
<font style="color:rgb(221, 74, 104);"> git add </font><font style="color:rgb(80, 161, 79);">.</font>


<!-- 这是一张图片，ocr 内容为： -->
!


** 3.2 commit提交项目**
<font style="color:rgb(221, 74, 104);">git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> commit -m </font><font style="color:rgb(80, 161, 79);">"初始化项目"</font>


<!-- 这是一张图片，ocr 内容为： -->
!


 如果本地Git没有设置用户名和邮箱的话，会提示设置用户名和邮箱
 git config --global user.name "root"
 git config --global user.email "wanghang0712@163.com"

 然后再执行 提交项目的命令
<font style="color:rgb(221, 74, 104);">git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> commit -m </font><font style="color:rgb(80, 161, 79);">"初始化项目"</font>

**<font style="color:rgb(77, 77, 77);">3.3 建立本地仓库和远程仓库关系并推送</font>**
 远程GitLab创建的项目地址为,例如:[http://192.168.56.101:8091/root/wanghang-springboot- depotstable.git](http://192.168.56.101:8091/root/wanghang-springboot-depotstable.git)
<font style="color:rgb(0, 0, 0);"> 执行命令</font>


<!-- 这是一张图片，ocr 内容为： -->
!


**<font style="color:rgb(77, 77, 77);">3.3.1 如果这一步出错</font>**
<font style="color:rgb(77, 77, 77);">如果在这一步时如果出现错误：fatal:remote origin already exists，需要先执行下面的命令清除关 联关系，然后再进行上一步动作</font>
<font style="color:rgb(77, 77, 77);"> 清除命令</font>
<font style="color:rgb(221, 74, 104);">git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> remote </font><font style="color:rgb(221, 74, 104);">rm</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> origin</font>
<font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> 再执行本地仓库关联远程仓库的命令</font>
**<font style="color:rgb(77, 77, 77);">3.3.2 查看关联是否成功</font>**
<font style="color:rgb(221, 74, 104);">git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> remote -v</font>


<!-- 这是一张图片，ocr 内容为： -->
!


**<font style="color:rgb(77, 77, 77);">3.4 推送至GitLab的远程仓库</font>**
** 3.4.1 先拉取下远程分支的内容**
<font style="color:rgb(221, 74, 104);"> git</font><font style="color:rgb(0, 0, 0);background-color:rgb(250, 250, 250);"> pull --rebase origin main</font>


<!-- 这是一张图片，ocr 内容为： -->
!


<font style="color:rgb(232, 50, 60);background-color:rgb(250, 250, 250);"> 这一步好像没什么用，还是会创建一个Master的分支？</font>
** 3.4.2 将本地的项目初始化到远程**
<font style="color:rgb(223, 42, 63);">git</font> push -u origin master


<!-- 这是一张图片，ocr 内容为： -->
!


**4 查看远程GitLab上的代码**
会创建一个master的分支，上传的代码也会再master分支上


<!-- 这是一张图片，ocr 内容为： -->
!


<font style="color:rgb(0, 0, 0);"> 初始化上传的代码再master分支上， 不过再push的时候先pull了下， 还是把Gitlab的main分支上README.md文件给拉去下来了， 这样master分支初始化的代码就是完整的。 </font>


<!-- 这是一张图片，ocr 内容为： -->
!


# 2 Git Cherry-pick（摘樱桃）

**1 IDEA的方式操作cherry-pick**
 1 在某个项目上的某个分支上wanghang-2022-02-26，有四次提交，只想要其中的第一和第四次提交


<!-- 这是一张图片，ocr 内容为： -->
!


 2 切换到目标分支：wanghang_idea_git_test


<!-- 这是一张图片，ocr 内容为： -->
!


3 在目标分支上查看Git的提交记录


<!-- 这是一张图片，ocr 内容为： -->
!


在第2步选着需要Cherry-pick到目标分支的开发分支，比如：wanghang-2022-02-26


<!-- 这是一张图片，ocr 内容为： -->
!


选择需要Cherry-pick提交的代码


<!-- 这是一张图片，ocr 内容为： -->
!


**2 通过Git命令的方式来Cherry-pick**

****

****

****

# 3 Git打Tag

**1 Git打Tag的命令**


<font style="color:rgba(140, 140, 140, 0.5);background-color:rgb(245, 245, 245);">Plain Text</font><font style="color:rgb(88, 90, 90);background-color:rgb(245, 245, 245);">复制代码</font>

<font style="color:rgb(108, 108, 108);">1</font>

<font style="color:rgb(108, 108, 108);">2</font>

<font style="color:rgb(108, 108, 108);">3</font>

<font style="color:rgb(108, 108, 108);">4</font>

<font style="color:rgb(38, 44, 49);">git tag -l # 查看</font>

<font style="color:rgb(38, 44, 49);">git tag -a 22.8.31-0.0.3 -m "demo tag" # 打tag</font>

<font style="color:rgb(38, 44, 49);">git tag -l # 查看</font>

<font style="color:rgb(38, 44, 49);">git push origin master --tags # 所有tag推动到远端</font>


**2 小疑问**
<font style="color:rgb(114, 46, 209);">1 Git打Tag与发布版本有什么关联？</font>
<font style="color:rgb(114, 46, 209);">2 Git打Tag是适用于以K8s容器化的自动化部署吗？</font>


参考
[权威SemVer语义化版本规范，Git打tag规范参考](https://semver.org/lang/zh-CN/spec/v2.0.0.html)

****

****

# 4 Git回滚提交
<font style="color:rgb(44, 44, 44);">本地回滚就很简单，只是要撤销 commit 信息即可，可以直接使用 </font>**<font style="color:rgb(44, 44, 44);">Reset HEAD</font>**<font style="color:rgb(44, 44, 44);">进行回滚，但是这种方式回滚只能回滚本地仓库，回滚本地仓库之后，通过pull，则又可以更新到最新的代码。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">还需要回滚远程分支上的代码。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 回退(易push到远程分支的代码)</font>**<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);"> 1.1 通过认知找到提交的commitid</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> git log
</font><font style="color:rgb(38, 38, 38);"> commitid的形式如：126f2066185分25879f2723ca421f4dee44ca8fe7
</font>**<font style="color:rgb(38, 38, 38);"> 1.2 执行回退命令</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> git reset --hard 126f2066185分25879f2723ca421f4dee44ca8fe7

</font>**<font style="color:rgb(38, 38, 38);"> reset 中带的参数：</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> mixed 默认方式,只保留源码，回退commit和index信息;
</font><font style="color:rgb(38, 38, 38);"> soft 回退到某个版本，本地源码还在，还可以进行提交然后再push，但是之前远程的提交记录是还在的。
</font><font style="color:rgb(38, 38, 38);"> hard 彻底回退，选择某个版本的提交Id，本地的提交记录可以回到这个id的版本，但是远程分支的没有回 退，还可以通过pull再进行拉取回来

</font>**<font style="color:rgb(38, 38, 38);"> 1.3 再提交推到远程</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> git push origin HEAD --force


</font>**<font style="color:rgb(38, 38, 38);"> 2 通过</font>****<font style="color:rgb(44, 44, 44);"> Revert命令回滚</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">如图所示，现在需要将远程仓库回滚到 dev-103 这次提交点。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">选中 </font>**<font style="color:rgb(44, 44, 44);">dev-103</font>**<font style="color:rgb(44, 44, 44);"> 这一行，右键选择 Revert</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">这里提示需要 commit</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">commit 之后，push 到远程仓库中。最终结果如下：</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">新增了一条提交记录，查看代码已经被回滚了</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(44, 44, 44);">其他开发人员如果进行了 pull，其本地仓库也被正确回滚到了 dev-103 提交点，就无需再担心回滚的代码又被重新 push 到远程仓库啦。</font><font style="color:rgb(38, 38, 38);">

</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>

# 5 Git如何撤回Merge

场景需要撤回Merge

<font style="color:rgb(38, 38, 38);"></font>

# GitLab的特性及使用参考


[深入理解GitLab的CI/DI](https://mp.weixin.qq.com/s/FwrrxdV_Qi-XWrKjt4zMig)
[基于GitLab的代码审查,简单实用](https://blog.csdn.net/youanyyou/article/details/104549283/)
[基于GitLab实现代码版本控制](https://www.cnblogs.com/wintersun/p/3930900.html)


参考
[GitLab学习资源(博文汇总)1](https://blog.csdn.net/weixin_40816738/category_8935379.html)


<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> </font>

# Git 常见的命令操作
**<font style="color:rgb(38, 38, 38);">1 Git打tag得命令</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 在自动部署得时候我们要基于Git上最新得代码， 一般是基于分支创建Tag， 然后发布这个tag得代码

</font>

```plain
git tag -l # 查看
git tag -a 22.8.31-0.0.3 -m "demo tag" # -m 是描述 打tag
git tag -l # 查看
git push origin master --tags # 所有tag推动到远端
```

参考

[Git 不要只会 pull 和 push，试试这 5 条提高效率的命令](https://mp.weixin.qq.com/s/BEqCeMstd4a_YH9h_cTWlQ)

<font style="color:rgb(38, 38, 38);"></font>

# Git中的Push和Focre Push

**1 Focre Push的使用场景**
<font style="color:rgb(68, 68, 68);">只有在需要用本地历史记录替换远程历史记录时才强制执行推送，这种情况发生在重写本地历史时，通常是通过</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">git rebase</font><font style="color:rgb(68, 68, 68);">重写的，或者本地仓库回退之后的，强制推送到远程；</font><font style="color:rgb(38, 38, 38);">

</font>


# Git 常用的命令


**1 分支**
<font style="color:rgb(77, 77, 77);">列出所有分支(本地分支)，并查看当前分支</font>
<font style="color:rgb(56, 58, 66);background-color:rgb(250, 250, 250);">git branch</font>


<!-- 这是一张图片，ocr 内容为： -->
!


<font style="color:rgb(77, 77, 77);">切换回 master 分支</font>
<font style="color:rgb(56, 58, 66);background-color:rgb(250, 250, 250);">git checkout master</font>


查看当前分支是从哪个分支创建的
git reflog show feature_evaluationSort_wanghang_2022-03-04


<!-- 这是一张图片，ocr 内容为： -->
!


参考
[常用的Git命令](https://blog.csdn.net/baidu_28340727/article/details/121727561)


# Git rebase
**<font style="color:rgb(38, 38, 38);">1 作用</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);">git rebase用于把一个分支的修改合并到当前分支;</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">2 使用场景</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);">假设你现在基于远程分支"origin"，创建一个叫"mywork"的分支。</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 在</font><font style="color:rgb(0, 0, 128);">origin分支上进行修改之后，然后提交；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);"> 在mywork分支上也进行修改，然后也提交；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);">解决，我们可以通过pull命令，把origin分支上的修改的代码拉下和我在mywork分支上的修改合并， 结果看起来就像一个新的"合并的提交"(merge commit)。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);">如果我们想</font><font style="color:rgb(77, 77, 77);">让"mywork"分支历史看起来没有经过任何合并，则需要使用 Git Rebase,</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 102, 255);">git checkout mywork</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 102, 255);">git rebase origin</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">3 Git Rebase的工作原理</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(77, 77, 77);">这些命令会把你的"mywork"分支里的每个提交(commit)取消掉，并且把它们临时 保存为补丁，这些补丁会保存在 .git/rebase目录中，然后把"mywork"分支更新 为最新的"origin"分支，最后把保存的这些补丁应用到"mywork"分支上.</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">4 在renase过程中的冲突</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 128);">在</font><font style="color:rgb(153, 51, 0);">rebase</font><font style="color:rgb(0, 0, 128);">的过程中，也许会出现冲突(conflict). 在这种情况，Git会停止rebase并会让你去解决冲突，在解决完冲突后，用"git-add"命令去更新这些内容的索引(index), 然后，你无需执行 git-commit,只要执行:</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">5 在IDEA中操作Git Rebase</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[https://blog.csdn.net/hudashi/article/details/7664631](https://blog.csdn.net/hudashi/article/details/7664631)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


# git fetch

<font style="color:rgb(51, 51, 51);">git中都fetch命令是将远程分支的最新内容拉到了本地，但是在本地看不到最新的变化；</font>
<font style="color:rgb(51, 51, 51);">在tortoiseGit中使用switch/checkout查看当前分支，发现此时后本地多了一个FETCH_HEAD的指针，checkout到该指针后可以查看远程分支的最新内容；</font>
<font style="color:rgb(51, 51, 51);">pull的作用就相当于fetch和merge，自动合并：git fetch origin master，git merge FETCH_HEAD，然后需要手动解决冲突，并commit。</font>

<font style="color:rgb(51, 51, 51);"></font>

# Gridea
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[零代码，教你搭建一个个人博客平台](https://blog.csdn.net/qq_30859353/article/details/116020979)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


# Git的开发规范

**1 版本控制**
<font style="color:rgb(77, 77, 77);"> git是当前比较流行的版本管理工具，下面我来总结下载实际开发过程中基于Git管理代码分支的一些经验。</font>

**<font style="color:rgb(77, 77, 77);">1.1 主要分支：Master、Develop</font>**
**<font style="color:rgb(77, 77, 77);">master</font>**<font style="color:rgb(77, 77, 77);">：永远和线上产品最后一次发布的代码一致，保证随时可发布。</font>
**<font style="color:rgb(77, 77, 77);">develop</font>**<font style="color:rgb(77, 77, 77);">：最新的开发完整功能的分支（完整功能是指某个模块、需求或者特性完全开发完成后才合并到develop上）。</font>
<font style="color:rgb(77, 77, 77);">这两个分支，所有开发人员都没有push权限，只有开发组长或者其他专人有merge权限，开发人员在自己的分支开发完成后，提交merge请求，开发组长或者其他专人负责review后进行合并。</font>

**<font style="color:rgb(77, 77, 77);">1.2 其他分支 </font>****<font style="color:rgb(79, 79, 79);">feature、hotfix、release</font>**
**<font style="color:rgb(77, 77, 77);">feature：</font>**<font style="color:rgb(77, 77, 77);">开发人员开发分支，从develop上自行拉取分支，待功能开发完成，合并到develop，然后提测。</font>
<font style="color:rgb(77, 77, 77);">开发分支的命名规范：feature-姓名-开发的功能-日期。如：feature-zhangsan-orderList-20181020</font>

**<font style="color:rgb(77, 77, 77);">hotfix</font>**<font style="color:rgb(77, 77, 77);">：紧急处理线上bug的分支。在线上有紧急bug需要修复的时候，从master拉取，修改完成测试通过之后，发布正式，然后合并到master和develop。</font>
<font style="color:rgb(77, 77, 77);">我们的命名规范为：hotfix-姓名-开发的功能-日期，例如：hotfix-zhangsan-importBugFix-20181020。</font>

**<font style="color:rgb(77, 77, 77);">release </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">为上线分支，提测阶段，会以release分支代码为基准提测。上线的话则将这个</font><font style="color:rgb(77, 77, 77);">分支合到Master上。</font>
<font style="color:rgb(77, 77, 77);">命名规范是按照迭代名称来取的，如：release-18.6.2-20220108</font>

<font style="color:rgb(114, 46, 209);">注意：</font>
1 当有一组feature开发完成，首先会合并到develop分支，进入提测时，测试通过之后，从Master分支上拉取最新的代码的Release分支，然后将多组feature分支合并到Release分支上，在预发布环境验证；
2 如果在还存在Bug的话，则直接从这个feature分支拉取开发分支进行修改，等全部验证通过之后，就以这个Release分支作为发布分支；
3 当测试完成以后，合并<font style="color:rgb(149, 65, 33);">release</font>分支到<font style="color:rgb(149, 65, 33);">master</font>和develop分支，此时<font style="color:rgb(149, 65, 33);">master</font>为最新代码，用做上线；
<font style="color:rgb(77, 77, 77);">4 每次发布完成合并后，要从master打tag，并删除已发布分支，上面就没有一一说明了。</font>


**<font style="color:rgb(77, 77, 77);">2 实际运用</font>**
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">系统开发过程当中经常使用的环境</font>


| **<font style="color:rgb(51, 51, 51);">简称</font>** | **<font style="color:rgb(51, 51, 51);">全称</font>** |
| --- | --- |
| <font style="color:rgb(51, 51, 51);">DEV</font> | <font style="color:rgb(51, 51, 51);">Development environment</font> |
| <font style="color:rgb(51, 51, 51);">FAT</font> | <font style="color:rgb(51, 51, 51);">Feature Acceptance Test environment</font> |
| <font style="color:rgb(51, 51, 51);">UAT</font> | <font style="color:rgb(51, 51, 51);">User Acceptance Test environment</font> |
| <font style="color:rgb(51, 51, 51);">PRO</font> | <font style="color:rgb(51, 51, 51);">Production environment</font> |


<font style="color:rgb(51, 51, 51);">●</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">DEV 环境：用于开发者调试使用。</font>
<font style="color:rgb(51, 51, 51);">●</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">FAT 环境：功能验收测试环境，用于测试环境下的软件测试者测试使用。</font>
<font style="color:rgb(51, 51, 51);">●</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">UAT 环境：用户验收测试环境，用于生产环境下的软件测试者测试使用。</font>
<font style="color:rgb(51, 51, 51);">●</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">PRO 环境：就是生产环境。</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">好比，项目域名为：</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">http://www.abc.com</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">，那么相关环境的域名可这样配置：</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">DEV 环境：本地配置虚拟域名便可</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">FAT 环境：</font>**<font style="background-color:rgb(247, 247, 249);">http://fat.abc.com</font>**
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">UAT 环境：</font>**<font style="background-color:rgb(247, 247, 249);">http://uat.abc.com</font>**
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">PRO 环境：</font>**<font style="background-color:rgb(247, 247, 249);">http://www.abc.com </font>**


| **<font style="color:rgb(51, 51, 51);">分支</font>** | **<font style="color:rgb(51, 51, 51);">名称</font>** | **<font style="color:rgb(51, 51, 51);">环境</font>** | **<font style="color:rgb(51, 51, 51);">可访问</font>** |
| --- | --- | --- | --- |
| <font style="color:rgb(51, 51, 51);">master</font> | <font style="color:rgb(51, 51, 51);">主分支</font> | <font style="color:rgb(51, 51, 51);">PRO</font> | <font style="color:rgb(51, 51, 51);">是</font> |
| <font style="color:rgb(51, 51, 51);">release</font> | <font style="color:rgb(51, 51, 51);">预上线分支</font> | <font style="color:rgb(51, 51, 51);">UAT</font> | <font style="color:rgb(51, 51, 51);">是</font> |
| <font style="color:rgb(51, 51, 51);">hotfix</font> | <font style="color:rgb(51, 51, 51);">紧急修复分支</font> | <font style="color:rgb(51, 51, 51);">DEV</font> | <font style="color:rgb(51, 51, 51);">否</font> |
| <font style="color:rgb(51, 51, 51);">develop</font> | <font style="color:rgb(51, 51, 51);">测试分支</font> | <font style="color:rgb(51, 51, 51);">FAT</font> | <font style="color:rgb(51, 51, 51);">是</font> |
| <font style="color:rgb(51, 51, 51);">feature</font> | <font style="color:rgb(51, 51, 51);">需求开发分支</font> | <font style="color:rgb(51, 51, 51);">DEV</font> | <font style="color:rgb(51, 51, 51);">否</font> |


**<font style="color:rgb(114, 46, 209);background-color:rgb(247, 247, 249);">master</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">为主分支，用于部署到</font><font style="color:rgb(245, 34, 45);background-color:rgb(254, 254, 254);">正式环境（PRO）</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">，通常由 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">release</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 或 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">hotfix</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支合并，任何状况下不容许直接在 master 分支上修改代码。</font><font style="color:rgb(255, 255, 255);background-color:rgb(254, 254, 254);">co</font>
**<font style="color:rgb(114, 46, 209);background-color:rgb(247, 247, 249);">release 分支</font>**
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 为预上线分支，用于部署到</font><font style="color:rgb(245, 34, 45);background-color:rgb(254, 254, 254);">预上线环境（UAT）</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">，始终保持与 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">master</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支一致，通常由 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">develop</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 或 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">hotfix</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支合并，不建议直接在 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">release</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支上直接修改代码。</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">若是在 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">release</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支测试出问题，须要回归验证 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">develop</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支看否存在此问题。</font>
**<font style="color:rgb(114, 46, 209);background-color:rgb(254, 254, 254);">hotfix 分支</font>**
**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">hotfix</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 为紧急修复分支，命名规则为 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">hotfix-</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 开头。当线上出现紧急问题须要立刻修复时，须要基于 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">rmaster</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支建立 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">hotfix</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支，修复完成后，再合并到 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">release</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 和</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">develop</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> ，一旦修复上线，便将其删除。</font>
**<font style="color:rgb(114, 46, 209);background-color:rgb(254, 254, 254);">develop 分支</font>**
**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">develop</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 为测试分支，用于部署到</font><font style="color:rgb(245, 34, 45);background-color:rgb(254, 254, 254);">测试环境（FAT）</font><font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">，始终保持最新完成以及 bug 修复后的代码，可根据需求大小程度肯定是由 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">feature</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 分支合并，仍是直接在上面开发。</font>
**<font style="color:rgb(114, 46, 209);background-color:rgb(254, 254, 254);">feature 分支</font>**
**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">feature</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 为需求开发分支，命名规则为 </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 247, 249);">feature-</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);"> 开头，一旦该需求上线，便将其删除。</font>


**<font style="color:rgb(51, 51, 51);background-color:rgb(254, 254, 254);">3 Git开发规范参考</font>**
**<font style="color:rgb(23, 43, 77);">一、Git分支命名</font>**<font style="color:rgb(23, 43, 77);">分支命名采用 分支类型/分支名 的格式，分支名仅可使用小写字母+数字。如： feature/v2.7 feature/support-function release/v1.2.1 hotfix/v3.1.0 custom/v3.0.1 </font>**<font style="color:rgb(23, 43, 77);">二、Git分支类型</font>**<font style="color:rgb(23, 43, 77);">1. 主分支 master 主分支 , 产品的功能全部实现后 , 最终在 master 分支对外发布 该分支为只读唯一分支 , 只能从其他分支(release/hotfix)合并 , 不能在此分支修改 另外所有在 master 分支的推送应该打标签做记录，方便追溯 例如 release 合并到 master , 或 hotfix 合并到 master 2. 主开发分支 develop 主开发分支 包含所有要发布到下一个 release 的代码 该分支为只读唯一分支 , 只能从其他分支合并 feature功能分支完成 , 合并到 develop (不推送) develop 拉取 release 分支 , 提测 release/hotfix 分支上线完毕 , 合并到 develop 并推送 3. 功能分支 feature 功能开发分支 , 基于 develop 分支克隆 , 主要用于新需求新功能的开发，主要用于多开发人员分工自维护 分支 功能开发完毕后合到 develop 分支 feature分支可同时存在多个 , 用于团队中多个功能同时开发 , 属于临时分支 , 功能完成后删除 4. 可测试分支 release 可交付分支 ，当前阶段的开发任务完成并达到可测试阶段，从develop分支克隆 主要用于提交给测试人员进行功能测试 , 测试过程中发现的BUG在本分支进行修复 修复完成上线后合并到develop/master 分支并推送(完成功能) , 打Tag 属于临时分支 , 功能上线后删除 5. 修复分支 bugfix 修复分支 , 基于master分支tag克隆 , 主要用于对线上的版本进行BUG修复 修复完毕后合并到 develop/master 分支并推送 , 打Tag 属于临时分支 , 补丁修复上线后可选删除 所有hotfix分支的修改会进入到下一个 release 6. 定制化分支 custom 定制化分支 用于维护特定现场的定制化版本支线 定制化分支从master分支tag拉取克隆，之后脱离整体Git Flow，独自维护 定制化分支所有的修改不得合并到develop、master等分支 </font>**<font style="color:rgb(23, 43, 77);">三、Git分支工作流程</font>**<font style="color:rgb(23, 43, 77);">针对不同的项目情况，Bugfix分支和Feature分支可以不使用 强烈建议使用完整的Git Flow进行协作，并且在 Feature合并入Develop 以及 Bugfix合并入Master 时，设置 Code Review 管控 合规的Flow协作，可以使后续的CI/CD集成更加顺畅 </font>**<font style="color:rgb(23, 43, 77);">四、Git Commit规范</font>**<font style="color:rgb(23, 43, 77);">目前，社区有多种 Commit message 的写法规范。目前使用最广的写法是Angular 规范风格，比较合理 和系统化，并且有配套的工具。 1. Commit message 的格式 每次提交，Commit message 都包括三个部分：header，body 和 footer。 <type>(<scope>): <subject> <BLANK LINE> <body> <BLANK LINE> <footer> header 是必需的，body 和 footer 可以省略。 Header Header部分只有一行，包括三个字段： type （必需）、 scope （可选）和 subject （必需）。 所以，一个提交所生成的结果应该为： feat(main.ts): update main.ts 或者 feat: update main.ts type 用于说明 commit 提交的类型 feat：新增功能 fix：修复bug docs：修改文档 refactor：代码重构，未新增任何功能和修复任何bug build：改变构建流程，新增依赖库、工具 style：仅仅修改了空格、缩进等，不改变代码逻辑 perf：改善性能和体现的修改 chore：非src和test的修改 test：测试用例的修改 ci：自动化流程配置修改 revert：回滚到上一个版本 如果type为 feat 和 fix ，则该 commit 将肯定出现在 Change log 之中。其他情况（ docs 、 chore 、 style 、 refactor 、 test ）由你决定，要不要放入 Change log，建议是不要。 scope commit 影响的范围 subject commit 目的的简短描述，不超过50字符 应该以动词开头，使用第一人称现在时，例如：change而不是changed 第一个字母小写 结尾不加（.） Body Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。 More detailed explanatory text, if necessary. Wrap it to about 72 characters or so. Further paragraphs come after blank lines. - Bullet points are okay, too - Use a hanging indent Footer Footer 部分只用于以下两种情况： 不兼容变动 如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的 描述、以及变动理由和迁移方法。</font>
<font style="color:rgb(23, 43, 77);">BREAKING CHANGE: isolate scope bindings definition has changed. To migrate the code follow the example below: Before: scope: { myAttr: 'attribute', } After: scope: { myAttr: '@', } The removed `inject` wasn't generaly useful for directives so there should be no code using it. 关闭Issue 如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。 Closes #234 2. Commit 格式工具 针对以上的规范，我们可以自己在Commit的时候按照既定规则提交，但可能存在不规范的行为。 推荐整体使用 commitizen/cz-cli 进行统一管控，保持风格统一 使用的插件： # 使用Commitizen提交时，系统将提示您在提交时填写所有必需的提交字段 commitizen # 用来规范提交信息 cz-conventional-changelog # 生成提交日志 安装插件 npm install commitizen cz-conventional-changelog conventional-changelog-cli-D package.json内配置 "config": { "commitizen": { "path": "./node_modules/cz-conventional-changelog" } } package.json 内 script 内添加指令 使用 npm run commit 代替 git commit 使用 npm run genlog 生成日志 "commit": "git-cz", "genlog": "conventional-changelog -p angular -i </font>[CHANGELOG.md](http://changelog.md/)<font style="color:rgb(23, 43, 77);"> -s" 当运行 npm run commit 时会出现交互选项。 运行 npm run genlog 生成日志 conventional-changelog-cli不会覆盖任何以前的变更日志。 新增的日志基于自上一个 commit的"Feature", "Fix", "Performance Improvement" 或 "Breaking Changes"。 如果这是您第一次使用此工具，并且想要生成所有以前的变更日志，则可以执行： conventional-changelog -p angular -i </font>[CHANGELOG.md](http://changelog.md/)<font style="color:rgb(23, 43, 77);"> -s -r 0</font>

<font style="color:rgb(23, 43, 77);"></font>

<font style="color:rgb(23, 43, 77);"></font>

<font style="color:rgb(23, 43, 77);"></font>

# 1 GitHub Wiki 页面的添加和设置
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(77, 77, 77);">一般使用 Markdown 来编写项目文档和 README.md 等。Markdown 一般情况下能够满足我们的文档编写需求，如果使用得当的话，效果也非常棒。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(96, 27, 222);">不过当项目文档比较长的时候，阅读体验可能就不是那么理想了，这种情况我想大家应该都曾经遇到过</font><font style="color:rgb(77, 77, 77);">。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(96, 27, 222);">GitHub 每一个项目都有一个独立完整的 Wiki 页面</font><font style="color:rgb(77, 77, 77);">，我们可以用它来实现项目信息管理，为项目提供更加完善的文档。我们可以把 Wiki 作为项目文档的一个重要组成部分，将冗长、具体的文档整理成 Wiki，将精简的、概述性的内容，放到项目中或是 README.md 里。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(77, 77, 77);">Wiki 是一种在网络上开放且可供多人协同创作的超文本系统，由沃德·坎宁安于 1995 年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。Wiki 站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见，或者对共同的主题进行扩展或者探讨。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1.1 </font>****<font style="color:rgb(77, 77, 77);"> Create the first page</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">首页</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">首页的效果</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(77, 77, 77);">1.2 Add a custom footer 按钮</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">底部栏</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(77, 77, 77);">custom footer的</font><font style="color:rgb(38, 38, 38);">效果</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(77, 77, 77);">1.3 Add a custom footer 按钮</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">右侧栏</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">效果</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[GitHub Wiki 页面的添加和设置](https://blog.csdn.net/Pieces_thinking/article/details/120635140)<font style="color:rgb(38, 38, 38);">
</font>[景瑞维权案例的参考](https://github.com/ZGreMount/JingRuiTianFuBinJiang/wiki)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


