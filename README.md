# later
Raycast (Wolf3d Style) Canvas/Javascript

Simple raycasting with perspective correction, textured walls, floor and ceiling. Very crude collision detection, you can walk through the corners of adjacent blocks.

Very slow, probably due to the way I coded it and the limited fillrate of canvas. Really could use some refactoring; like most of my stuff on github, it's a hack job.

Recently modified to use direct pixel access, fake shading/fog, moving clouds (which only read the green bits to make it look overcast). It's faster now, still not speedy. Needs to be reorganized and less hacky.

Works in Firefox, Chrome, IE11. Edge has a keypress bug, so it works, but it's wonky.

![alt tag](https://raw.githubusercontent.com/gregfrazier/later/master/sample.jpg)

The map at the top is a map editor, click to add or remove (you could use the console to dump the array to text)
