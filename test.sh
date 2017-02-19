items=$(mdfind kind:app)
IFS=$'\n'
for item in $items; do
  name=$(basename $item)
  echo $item
  ./build/app2png-rs $item convert_2/$name.png
done
