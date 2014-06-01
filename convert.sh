#!/bin/sh

# echo -e "`echo $1 | sed 's/\.\(cells\|lif\)$//'`: [\"\", \"\", `cat $1 | grep -v '!|#' | grep -oE "[\.O\*]+" | sed 's/^/"../g' | sed 's/$/..",/g'` \"\", \"\"]" | tr "O" "*" | tr "\n" "_" | sed 's/_//g' | sed 's/, /,/g' | sed 's/"\.\+"/""/g' | xsel -b
echo -e "`echo $1 | sed 's/\.\(cells\|lif\)$//'`: [\"\", \"\", `cat $1 | grep -v '!|#' | grep -oE "[\.O\*]+" | sed 's/^/"../g' | sed 's/$/..",/g'` \"\", \"\"]" | tr "O" "*" | tr "\n" "_" | sed 's/_//g' | sed 's/, /,/g' | sed 's/"\.\+"/""/g' | sed 's/\[\("",\)\+/\[\1\1/g' | sed 's/\("",\)\+\]/\1\]/g' | xsel -b
