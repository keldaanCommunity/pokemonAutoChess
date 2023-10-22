ts-node gen/generate-maps.ts

$folder = Get-ChildItem "tests\samples"

foreach ($file in $folder) {
    & "C:\Program Files\Tiled\tmxrasterizer.exe" $file.FullName ($file.BaseName + '-preview.png')
}