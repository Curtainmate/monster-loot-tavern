Add-Type -AssemblyName System.Drawing

$ManualDir = "C:\AI\Codex\Manual"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function New-Bitmap($width, $height) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $graphics.Clear([System.Drawing.Color]::Transparent)
  return @($bitmap, $graphics)
}

function Find-ColumnSegments($bitmap) {
  $columns = New-Object System.Collections.Generic.List[int]
  for ($x = 0; $x -lt $bitmap.Width; $x++) {
    $hasPixel = $false
    for ($y = 0; $y -lt $bitmap.Height; $y++) {
      if ($bitmap.GetPixel($x, $y).A -gt 10) {
        $hasPixel = $true
        break
      }
    }
    if ($hasPixel) { $columns.Add($x) }
  }

  $segments = New-Object System.Collections.Generic.List[object]
  if ($columns.Count -eq 0) { return $segments }

  $start = $columns[0]
  $previous = $columns[0]
  for ($i = 1; $i -lt $columns.Count; $i++) {
    $x = $columns[$i]
    if ($x -gt $previous + 1) {
      $segments.Add([pscustomobject]@{ Start = $start; End = $previous })
      $start = $x
    }
    $previous = $x
  }
  $segments.Add([pscustomobject]@{ Start = $start; End = $previous })
  return $segments
}

function Find-Bounds($bitmap, $segment) {
  $minX = $segment.Start
  $maxX = $segment.End
  $minY = $bitmap.Height
  $maxY = -1
  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    for ($x = $segment.Start; $x -le $segment.End; $x++) {
      if ($bitmap.GetPixel($x, $y).A -gt 10) {
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  return [pscustomobject]@{
    X = $minX
    Y = $minY
    Width = $maxX - $minX + 1
    Height = $maxY - $minY + 1
  }
}

function Convert-Sheet($sourceName, $outputName, $expectedFrames, $frameSize, $padding) {
  $sourcePath = Join-Path $ManualDir $sourceName
  $source = [System.Drawing.Bitmap]::FromFile($sourcePath)
  $segments = @(Find-ColumnSegments $source)
  if ($segments.Count -ne $expectedFrames) {
    $source.Dispose()
    throw "$sourceName has $($segments.Count) detected frames, expected $expectedFrames."
  }

  $sheet = New-Bitmap ($frameSize * $expectedFrames) $frameSize
  $outBitmap = $sheet[0]
  $graphics = $sheet[1]

  for ($i = 0; $i -lt $expectedFrames; $i++) {
    $bounds = Find-Bounds $source $segments[$i]
    $scale = [Math]::Min(($frameSize - ($padding * 2)) / $bounds.Width, ($frameSize - ($padding * 2)) / $bounds.Height)
    $drawWidth = [Math]::Max(1, [Math]::Round($bounds.Width * $scale))
    $drawHeight = [Math]::Max(1, [Math]::Round($bounds.Height * $scale))
    $drawX = ($i * $frameSize) + [Math]::Floor(($frameSize - $drawWidth) / 2)
    $drawY = [Math]::Floor(($frameSize - $drawHeight) / 2)
    $sourceRect = New-Object System.Drawing.Rectangle $bounds.X, $bounds.Y, $bounds.Width, $bounds.Height
    $targetRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight
    $graphics.DrawImage($source, $targetRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
  }

  $outputPath = Join-Path $OutDir $outputName
  $graphics.Dispose()
  $outBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $outBitmap.Dispose()
  $source.Dispose()
}

function Convert-Single($sourceName, $outputName, $frameSize, $padding) {
  $sourcePath = Join-Path $ManualDir $sourceName
  $source = [System.Drawing.Bitmap]::FromFile($sourcePath)
  $segment = [pscustomobject]@{ Start = 0; End = $source.Width - 1 }
  $bounds = Find-Bounds $source $segment

  $sheet = New-Bitmap $frameSize $frameSize
  $outBitmap = $sheet[0]
  $graphics = $sheet[1]
  $scale = [Math]::Min(($frameSize - ($padding * 2)) / $bounds.Width, ($frameSize - ($padding * 2)) / $bounds.Height)
  $drawWidth = [Math]::Max(1, [Math]::Round($bounds.Width * $scale))
  $drawHeight = [Math]::Max(1, [Math]::Round($bounds.Height * $scale))
  $drawX = [Math]::Floor(($frameSize - $drawWidth) / 2)
  $drawY = [Math]::Floor(($frameSize - $drawHeight) / 2)
  $sourceRect = New-Object System.Drawing.Rectangle $bounds.X, $bounds.Y, $bounds.Width, $bounds.Height
  $targetRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight
  $graphics.DrawImage($source, $targetRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)

  $outputPath = Join-Path $OutDir $outputName
  $graphics.Dispose()
  $outBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $outBitmap.Dispose()
  $source.Dispose()
}

function Clamp-Byte($value) {
  return [Math]::Max(0, [Math]::Min(255, [Math]::Round($value)))
}

function Recolor-Sheet($sourceName, $outputName, $mode) {
  $sourcePath = Join-Path $OutDir $sourceName
  $source = [System.Drawing.Bitmap]::FromFile($sourcePath)
  $target = New-Object System.Drawing.Bitmap $source.Width, $source.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      $c = $source.GetPixel($x, $y)
      if ($c.A -le 10) {
        $target.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }

      $r = $c.R
      $g = $c.G
      $b = $c.B
      switch ($mode) {
        "yellowSlime" {
          if ($g -gt $r * 1.08 -and $g -gt $b * 1.08) {
            $r = Clamp-Byte($g * 1.28 + $r * 0.18)
            $g = Clamp-Byte($g * 1.08 + 18)
            $b = Clamp-Byte($b * 0.28)
          }
        }
        "redGoblin" {
          if ($g -gt $r * 0.82 -and $g -gt $b * 1.05) {
            $r = Clamp-Byte($g * 1.18 + 38)
            $g = Clamp-Byte($g * 0.34)
            $b = Clamp-Byte($b * 0.28)
          } elseif ($r -gt 45 -or $g -gt 45 -or $b -gt 45) {
            $r = Clamp-Byte($r * 1.12 + 12)
            $g = Clamp-Byte($g * 0.72)
            $b = Clamp-Byte($b * 0.68)
          }
        }
        "blackWolf" {
          if ([Math]::Abs($r - $g) -lt 42 -and [Math]::Abs($g - $b) -lt 42) {
            $lum = ($r * 0.3) + ($g * 0.59) + ($b * 0.11)
            $r = Clamp-Byte($lum * 0.34 + 18)
            $g = Clamp-Byte($lum * 0.34 + 18)
            $b = Clamp-Byte($lum * 0.38 + 24)
          }
        }
      }
      $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $r, $g, $b))
    }
  }

  $outputPath = Join-Path $OutDir $outputName
  $target.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $target.Dispose()
  $source.Dispose()
}

Convert-Sheet "Warrior sprites.png" "player.png" 8 144 8
Convert-Sheet "Ranger sprites.png" "ranger.png" 8 144 8
Convert-Sheet "Goblin sprites.png" "goblin.png" 8 144 8
Convert-Sheet "Slime sprites.png" "slime.png" 8 144 8
Convert-Sheet "Wolf sprites.png" "wolf.png" 8 144 8
Convert-Sheet "Powerups sprites.png" "powerups.png" 5 128 8
Convert-Sheet "Treasure_chest_sprites.png" "chest.png" 4 160 8
Convert-Single "Shopkeeper_sprites.png" "shopkeeper.png" 160 8
Recolor-Sheet "slime.png" "slime_yellow.png" "yellowSlime"
Recolor-Sheet "goblin.png" "goblin_red.png" "redGoblin"
Recolor-Sheet "wolf.png" "wolf_black.png" "blackWolf"
