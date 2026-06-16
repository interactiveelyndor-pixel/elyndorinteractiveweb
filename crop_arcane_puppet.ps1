Add-Type -AssemblyName System.Drawing
$imgPath = "c:\Users\monis\.gemini\antigravity\scratch\ElyndorInteractive\assets\the_arcane_puppet.png"
$tempPath = "c:\Users\monis\.gemini\antigravity\scratch\ElyndorInteractive\assets\the_arcane_puppet_new.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$cropHeight = $img.Height - 160
$rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $cropHeight)
$bmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rect.Width, $rect.Height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Dispose()
$img.Dispose()
$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Remove-Item $imgPath
Rename-Item $tempPath "the_arcane_puppet.png"
