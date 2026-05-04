Add-Type -AssemblyName System.Drawing

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

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Rect($g, $x, $y, $w, $h, $hex) {
  $b = Brush $hex
  $g.FillRectangle($b, $x, $y, $w, $h)
  $b.Dispose()
}

function Save-Sheet($bitmap, $graphics, $name) {
  $path = Join-Path $OutDir $name
  $graphics.Dispose()
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function FrameLabel($g, $x, $y, $color) {
  Rect $g ($x + 1) ($y + 29) 30 2 $color
}

function Outline-Rect($g, $x, $y, $w, $h, $fill, $edge) {
  Rect $g $x $y $w $h $edge
  Rect $g ($x + 1) ($y + 1) ($w - 2) ($h - 2) $fill
}

function Draw-Adventurer($g, $x, $y, $pose, $slash) {
  $bob = if ($pose % 2 -eq 1) { 1 } else { 0 }
  Rect $g ($x + 8) ($y + 28) 17 2 "#172019"
  Outline-Rect $g ($x + 10) ($y + 7 + $bob) 12 7 "#f0bd83" "#21140e"
  Rect $g ($x + 9) ($y + 5 + $bob) 14 4 "#5b3820"
  Rect $g ($x + 11) ($y + 4 + $bob) 11 2 "#7a4b29"
  Outline-Rect $g ($x + 8) ($y + 14 + $bob) 16 11 "#2f6ed3" "#172243"
  Rect $g ($x + 10) ($y + 15 + $bob) 4 9 "#5d98f0"
  Rect $g ($x + 17) ($y + 15 + $bob) 5 9 "#244da5"
  Rect $g ($x + 14) ($y + 16 + $bob) 3 9 "#d1b36e"
  Rect $g ($x + 11) ($y + 25) 4 5 "#273f8f"
  Rect $g ($x + 18) ($y + 25) 4 5 "#273f8f"
  Rect $g ($x + 8) ($y + 15 + $bob) 3 8 "#f0bd83"
  Rect $g ($x + 23) ($y + 15 + $bob) 3 8 "#f0bd83"
  Rect $g ($x + 13) ($y + 10 + $bob) 2 2 "#1a120c"
  Rect $g ($x + 18) ($y + 10 + $bob) 2 2 "#1a120c"
  Rect $g ($x + 15) ($y + 12 + $bob) 3 1 "#b9785e"
  if ($pose -eq 1) {
    Rect $g ($x + 8) ($y + 25) 4 5 "#273f8f"
    Rect $g ($x + 21) ($y + 25) 4 5 "#273f8f"
  }
  if ($pose -eq 2) {
    Rect $g ($x + 24) ($y + 12) 3 11 "#d8d0bd"
    Rect $g ($x + 27) ($y + 10) 2 6 "#fff0b0"
  }
  if ($slash) {
    Rect $g ($x + 20) ($y + 6) 10 2 "#fff7bf"
    Rect $g ($x + 23) ($y + 9) 8 3 "#f0cb66"
    Rect $g ($x + 25) ($y + 13) 5 2 "#d58d46"
  }
}

function Draw-Ranger($g, $x, $y, $pose, $shoot) {
  $bob = if ($pose % 2 -eq 1) { 1 } else { 0 }
  Rect $g ($x + 8) ($y + 28) 17 2 "#172019"
  Outline-Rect $g ($x + 10) ($y + 7 + $bob) 12 7 "#e2b47b" "#21140e"
  Rect $g ($x + 9) ($y + 5 + $bob) 14 4 "#3f4d28"
  Rect $g ($x + 12) ($y + 4 + $bob) 8 2 "#667c3d"
  Outline-Rect $g ($x + 8) ($y + 14 + $bob) 16 11 "#3f8f55" "#162b19"
  Rect $g ($x + 10) ($y + 15 + $bob) 4 9 "#69b06a"
  Rect $g ($x + 17) ($y + 15 + $bob) 5 9 "#2e6d42"
  Rect $g ($x + 13) ($y + 15 + $bob) 3 10 "#8a562c"
  Rect $g ($x + 11) ($y + 25) 4 5 "#35452b"
  Rect $g ($x + 18) ($y + 25) 4 5 "#35452b"
  Rect $g ($x + 8) ($y + 15 + $bob) 3 8 "#e2b47b"
  Rect $g ($x + 23) ($y + 15 + $bob) 3 8 "#e2b47b"
  Rect $g ($x + 13) ($y + 10 + $bob) 2 2 "#1a120c"
  Rect $g ($x + 18) ($y + 10 + $bob) 2 2 "#1a120c"
  Rect $g ($x + 6) ($y + 10 + $bob) 2 14 "#6a4427"
  Rect $g ($x + 7) ($y + 9 + $bob) 1 3 "#d9d2c1"
  Rect $g ($x + 7) ($y + 22 + $bob) 1 3 "#d9d2c1"
  if ($pose -eq 1) {
    Rect $g ($x + 8) ($y + 25) 4 5 "#35452b"
    Rect $g ($x + 21) ($y + 25) 4 5 "#35452b"
  }
  if ($shoot) {
    Rect $g ($x + 23) ($y + 14) 7 2 "#d9d2c1"
    Rect $g ($x + 28) ($y + 13) 2 4 "#fff0a6"
    Rect $g ($x + 21) ($y + 11) 2 10 "#6a4427"
  }
}

function Draw-Slime($g, $x, $y, $pose, $hurt, $dead) {
  $body = if ($hurt) { "#ffffff" } elseif ($dead) { "#3b8f4b" } else { "#61c96f" }
  $dark = "#2f8a42"
  $squash = if ($pose % 2 -eq 0) { 0 } else { 2 }
  Rect $g ($x + 7) ($y + 27) 18 2 "#172019"
  Outline-Rect $g ($x + 6) ($y + 14 + $squash) 20 (12 - $squash) $body "#16361e"
  Outline-Rect $g ($x + 10) ($y + 10 + $squash) 12 8 $body "#16361e"
  Rect $g ($x + 10) ($y + 13 + $squash) 8 3 "#98f19d"
  Rect $g ($x + 9) ($y + 23) 14 3 $dark
  Rect $g ($x + 11) ($y + 15) 3 3 "#142213"
  Rect $g ($x + 18) ($y + 15) 3 3 "#142213"
  Rect $g ($x + 13) ($y + 20) 6 1 "#245f32"
  if ($dead) {
    Rect $g ($x + 5) ($y + 25) 22 3 "#2d6d3c"
    Rect $g ($x + 8) ($y + 22) 4 2 "#72e782"
  }
}

function Draw-Goblin($g, $x, $y, $pose, $attack, $hurt, $dead) {
  $skin = if ($hurt) { "#ffffff" } else { "#7db15c" }
  $bob = if ($pose % 2 -eq 1) { 1 } else { 0 }
  Rect $g ($x + 8) ($y + 29) 18 2 "#172019"
  Outline-Rect $g ($x + 10) ($y + 8 + $bob) 12 8 $skin "#1a2112"
  Rect $g ($x + 11) ($y + 6 + $bob) 10 3 "#4b3722"
  Outline-Rect $g ($x + 8) ($y + 15 + $bob) 16 10 "#6c4a2e" "#241810"
  Rect $g ($x + 10) ($y + 16 + $bob) 5 8 "#8b623d"
  Rect $g ($x + 6) ($y + 11 + $bob) 5 5 $skin
  Rect $g ($x + 21) ($y + 11 + $bob) 5 5 $skin
  Rect $g ($x + 10) ($y + 25) 4 5 "#443023"
  Rect $g ($x + 18) ($y + 25) 4 5 "#443023"
  Rect $g ($x + 13) ($y + 10) 2 2 "#10100b"
  Rect $g ($x + 18) ($y + 10) 2 2 "#10100b"
  Rect $g ($x + 14) ($y + 13) 5 1 "#26351c"
  if ($attack) {
    Rect $g ($x + 23) ($y + 15) 7 3 "#b9b3a3"
    Rect $g ($x + 28) ($y + 14) 2 1 "#f3ecd1"
  }
  if ($dead) {
    Rect $g ($x + 7) ($y + 24) 19 5 "#4c3629"
    Rect $g ($x + 12) ($y + 22) 8 2 "#7db15c"
  }
}

function Draw-Wolf($g, $x, $y, $pose, $attack, $hurt, $dead) {
  $fur = if ($hurt) { "#ffffff" } else { "#b9b4a3" }
  $stride = if ($pose % 2 -eq 1) { 1 } else { 0 }
  Rect $g ($x + 7) ($y + 28) 21 2 "#172019"
  Outline-Rect $g ($x + 7) ($y + 13) 18 10 $fur "#36322a"
  Rect $g ($x + 9) ($y + 14) 8 3 "#d8d3c5"
  Outline-Rect $g ($x + 18) ($y + 9) 10 8 $fur "#36322a"
  Rect $g ($x + 20) ($y + 7) 3 4 "#e5dfcf"
  Rect $g ($x + 24) ($y + 7) 3 4 "#e5dfcf"
  Rect $g ($x + 6) ($y + 15) 3 3 "#8f8878"
  Rect $g ($x + 8) ($y + 22) 4 (6 - $stride) "#7f7869"
  Rect $g ($x + 18) ($y + 22) 4 (6 - $stride) "#7f7869"
  Rect $g ($x + 13) ($y + 22) 3 5 "#5f594f"
  Rect $g ($x + 25) ($y + 13) 2 2 "#11110e"
  if ($attack) {
    Rect $g ($x + 27) ($y + 15) 4 2 "#fff6d6"
    Rect $g ($x + 26) ($y + 17) 3 2 "#a45746"
  }
  if ($dead) {
    Rect $g ($x + 7) ($y + 24) 21 4 "#7f7869"
    Rect $g ($x + 18) ($y + 22) 8 2 "#b9b4a3"
  }
}

function Draw-Loot($g, $x, $y, $kind) {
  switch ($kind) {
    0 { Rect $g ($x + 4) ($y + 9) 9 5 "#16361e"; Rect $g ($x + 5) ($y + 7) 7 6 "#72e782"; Rect $g ($x + 7) ($y + 6) 4 2 "#b9ffc0" }
    1 { Rect $g ($x + 4) ($y + 3) 9 12 "#3e5727"; Rect $g ($x + 5) ($y + 4) 7 10 "#b7d276"; Rect $g ($x + 7) ($y + 6) 3 5 "#7db15c" }
    2 { Rect $g ($x + 2) ($y + 5) 12 9 "#5c564e"; Rect $g ($x + 3) ($y + 5) 10 8 "#d8d1bd"; Rect $g ($x + 5) ($y + 7) 7 4 "#9f9787" }
    3 { Rect $g ($x + 6) ($y + 2) 5 12 "#333842"; Rect $g ($x + 7) ($y + 2) 3 11 "#a7aeb9"; Rect $g ($x + 5) ($y + 10) 7 2 "#6a5034"; Rect $g ($x + 8) ($y + 1) 2 2 "#ece8db" }
    4 { Rect $g ($x + 6) ($y + 3) 6 11 "#7b6848"; Rect $g ($x + 7) ($y + 3) 4 10 "#efe2b4"; Rect $g ($x + 8) ($y + 11) 2 3 "#b79e73" }
  }
}

function Draw-Powerup($g, $x, $y, $kind) {
  switch ($kind) {
    0 {
      Rect $g ($x + 3) ($y + 11) 10 3 "#5a1717"
      Rect $g ($x + 4) ($y + 4) 8 8 "#e4564d"
      Rect $g ($x + 6) ($y + 2) 4 12 "#ffad5c"
      Rect $g ($x + 7) ($y + 5) 2 6 "#fff0a6"
    }
    1 {
      Rect $g ($x + 4) ($y + 5) 4 3 "#ff9aa5"
      Rect $g ($x + 8) ($y + 5) 4 3 "#ff9aa5"
      Rect $g ($x + 3) ($y + 8) 10 4 "#e83f55"
      Rect $g ($x + 5) ($y + 12) 6 2 "#b62338"
      Rect $g ($x + 6) ($y + 7) 2 2 "#fff0f0"
    }
    2 {
      Rect $g ($x + 3) ($y + 10) 10 2 "#255a80"
      Rect $g ($x + 5) ($y + 4) 7 5 "#86d7ff"
      Rect $g ($x + 3) ($y + 7) 9 4 "#5fb5e8"
      Rect $g ($x + 7) ($y + 2) 3 11 "#fff0a6"
      Rect $g ($x + 10) ($y + 5) 3 2 "#dff7ff"
    }
    3 {
      Rect $g ($x + 4) ($y + 3) 8 3 "#d9ecff"
      Rect $g ($x + 3) ($y + 6) 10 5 "#8fb5ff"
      Rect $g ($x + 5) ($y + 11) 6 3 "#4a6dcc"
      Rect $g ($x + 7) ($y + 6) 2 6 "#fff0a6"
      Rect $g ($x + 5) ($y + 5) 2 2 "#ffffff"
    }
    4 {
      Rect $g ($x + 2) ($y + 7) 12 3 "#ffd46b"
      Rect $g ($x + 5) ($y + 4) 8 2 "#fff0a6"
      Rect $g ($x + 3) ($y + 11) 8 2 "#d68a3d"
      Rect $g ($x + 7) ($y + 2) 3 12 "#ffe18a"
      Rect $g ($x + 11) ($y + 4) 2 2 "#fff8c9"
    }
  }
}

function Draw-Chest($g, $x, $y, $frame) {
  Rect $g ($x + 7) ($y + 27) 18 2 "#172019"
  if ($frame -eq 3) {
    Outline-Rect $g ($x + 6) ($y + 16) 20 10 "#8a562c" "#2a170d"
    Outline-Rect $g ($x + 7) ($y + 9) 18 8 "#b8793f" "#2a170d"
    Rect $g ($x + 10) ($y + 12) 12 3 "#ffd46b"
    Rect $g ($x + 14) ($y + 18) 5 5 "#f5d279"
    Rect $g ($x + 11) ($y + 7) 3 2 "#fff0a6"
    Rect $g ($x + 22) ($y + 8) 2 2 "#fff0a6"
    return
  }
  $glint = if ($frame -eq 1) { "#fff0a6" } else { "#f5d279" }
  Outline-Rect $g ($x + 6) ($y + 13) 20 13 "#8a562c" "#2a170d"
  Rect $g ($x + 8) ($y + 15) 16 3 "#b8793f"
  Rect $g ($x + 8) ($y + 21) 16 3 "#6a3d21"
  Outline-Rect $g ($x + 9) ($y + 9) 14 8 "#b8793f" "#2a170d"
  Rect $g ($x + 15) ($y + 15) 4 6 "#f5d279"
  Rect $g ($x + 16) ($y + 17) 2 2 "#6a4a25"
  Rect $g ($x + 11 + $frame) ($y + 10) 4 2 $glint
}

function Draw-Tile($g, $x, $y, $base, $detail) {
  Rect $g $x $y 32 32 $base
  foreach ($d in $detail) {
    Rect $g ($x + $d[0]) ($y + $d[1]) $d[2] $d[3] $d[4]
  }
}

$sheet = New-Bitmap 256 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 8; $i++) { Draw-Adventurer $g ($i * 32) 0 ($i % 3) ($i -ge 4 -and $i -le 6) }
Save-Sheet $bmp $g "player.png"

$sheet = New-Bitmap 256 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 8; $i++) { Draw-Ranger $g ($i * 32) 0 ($i % 3) ($i -ge 4 -and $i -le 6) }
Save-Sheet $bmp $g "ranger.png"

$sheet = New-Bitmap 256 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 8; $i++) { Draw-Slime $g ($i * 32) 0 $i ($i -eq 4) ($i -ge 5) }
Save-Sheet $bmp $g "slime.png"

$sheet = New-Bitmap 256 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 8; $i++) { Draw-Goblin $g ($i * 32) 0 $i ($i -ge 4 -and $i -le 5) ($i -eq 6) ($i -eq 7) }
Save-Sheet $bmp $g "goblin.png"

$sheet = New-Bitmap 256 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 8; $i++) { Draw-Wolf $g ($i * 32) 0 $i ($i -ge 4 -and $i -le 5) ($i -eq 6) ($i -eq 7) }
Save-Sheet $bmp $g "wolf.png"

$sheet = New-Bitmap 80 16
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 5; $i++) { Draw-Loot $g ($i * 16) 0 $i }
Save-Sheet $bmp $g "loot.png"

$sheet = New-Bitmap 80 16
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 5; $i++) { Draw-Powerup $g ($i * 16) 0 $i }
Save-Sheet $bmp $g "powerups.png"

$sheet = New-Bitmap 128 32
$bmp = $sheet[0]; $g = $sheet[1]
for ($i = 0; $i -lt 4; $i++) { Draw-Chest $g ($i * 32) 0 $i }
Save-Sheet $bmp $g "chest.png"

$sheet = New-Bitmap 256 64
$bmp = $sheet[0]; $g = $sheet[1]
Draw-Tile $g 0 0 "#367a3b" @(@(4, 7, 5, 2, "#255a2d"), @(19, 20, 7, 2, "#2b6634"), @(10, 27, 4, 2, "#5ba84d"), @(26, 8, 3, 2, "#224925"))
Draw-Tile $g 32 0 "#3f8241" @(@(5, 5, 4, 3, "#62a653"), @(20, 15, 5, 2, "#2f6b35"), @(11, 25, 4, 2, "#73b96a"), @(14, 10, 3, 3, "#e5d96e"), @(24, 24, 2, 2, "#e9f0a3"))
Draw-Tile $g 64 0 "#806040" @(@(0, 0, 32, 3, "#9b7650"), @(6, 15, 20, 3, "#6c4d34"), @(4, 24, 6, 2, "#a87a4d"), @(22, 7, 5, 2, "#5c422f"))
Draw-Tile $g 96 0 "#68401f" @(@(0, 8, 32, 3, "#7f512b"), @(0, 22, 32, 3, "#7f512b"), @(8, 0, 3, 32, "#5b351d"), @(23, 0, 3, 32, "#7a4a28"))
Draw-Tile $g 128 0 "#2c1b13" @(@(4, 4, 24, 6, "#3d2519"), @(5, 20, 22, 5, "#1c120d"), @(3, 13, 26, 3, "#4a2c1d"), @(15, 5, 2, 22, "#17100b"))
Draw-Tile $g 160 0 "#d8a452" @(@(4, 4, 24, 24, "#8a562c"), @(7, 6, 18, 4, "#b8793f"), @(24, 16, 3, 3, "#f5d279"), @(15, 4, 2, 24, "#5b3820"))
Draw-Tile $g 192 0 "#2e6b35" @(@(0, 0, 32, 5, "#1f4f29"), @(0, 27, 32, 5, "#1f4f29"), @(0, 7, 5, 18, "#255a2d"), @(27, 7, 5, 18, "#255a2d"))
Draw-Tile $g 224 0 "#51413a" @(@(3, 6, 26, 18, "#8b8b7a"), @(9, 9, 10, 4, "#b2b09a"), @(20, 16, 6, 3, "#6f6d62"), @(5, 22, 20, 3, "#3d332e"))
Draw-Tile $g 0 32 "#224925" @(@(11, 2, 11, 20, "#52321f"), @(3, 0, 26, 24, "#1f5b32"), @(8, 0, 18, 15, "#2d7441"), @(13, 3, 7, 6, "#3d8c4c"), @(8, 24, 18, 5, "#142f1b"))
Draw-Tile $g 32 32 "#2e6b35" @(@(7, 12, 17, 13, "#2a6632"), @(11, 9, 10, 8, "#438b4b"), @(6, 22, 20, 3, "#1f4f29"), @(13, 12, 4, 3, "#66ad64"))
Draw-Tile $g 64 32 "#68401f" @(@(4, 6, 24, 16, "#3c2518"), @(6, 8, 20, 6, "#a56f35"), @(6, 18, 20, 3, "#24160f"), @(12, 4, 3, 20, "#7f512b"))
Draw-Tile $g 96 32 "#2e6b35" @(@(10, 6, 12, 17, "#5b3923"), @(6, 22, 20, 5, "#3c2a20"), @(8, 7, 16, 3, "#7b4d2d"), @(13, 13, 5, 5, "#432817"))
Save-Sheet $bmp $g "tileset.png"
