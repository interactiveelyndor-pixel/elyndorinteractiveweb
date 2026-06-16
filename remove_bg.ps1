Add-Type -AssemblyName System.Drawing

$workingDir = "C:\Users\monis\.gemini\antigravity\scratch\ElyndorInteractive"
$inputPath = Join-Path $workingDir "assets\logo.png"
$tempPath = Join-Path $workingDir "assets\logo_temp.png"

Write-Host "Processing $inputPath..."

# Load image (create a copy to avoid locking the file)
$originalImg = [System.Drawing.Image]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($originalImg)
$originalImg.Dispose()

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        
        # Check for black or near-black pixels (threshold of 30)
        # Also check alpha to avoid messing with already transparent pixels
        if ($pixel.A -gt 0 -and $pixel.R -lt 30 -and $pixel.G -lt 30 -and $pixel.B -lt 30) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# Replace original
Move-Item -Path $tempPath -Destination $inputPath -Force

Write-Host "Done. Background removed."
