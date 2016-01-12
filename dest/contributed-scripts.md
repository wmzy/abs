# Appendix A. 捐献的脚本

这些脚本展示了一些有趣的shell编程技术, 但是它们并不适合放入本文档的文本讲解中. 不过它们还是非常有用, 运行和分析它们都是很有意思的事.

译者: 这里留给那些有能力而且有多余时间的读者来详读, 个人认为翻译这些注释有点画蛇添足.

* * *

**例子 A-1\. **mailformat**: 格式化一个e-mail消息**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # mail-format.sh (ver. 1.1): Format e-mail messages.
  3 
  4 # Gets rid of carets, tabs, and also folds excessively long lines.
  5 
  6 # =================================================================
  7 #                 Standard Check for Script Argument(s)
  8 ARGS=1
  9 E_BADARGS=65
 10 E_NOFILE=66
 11 
 12 if [ $# -ne $ARGS ]  # Correct number of arguments passed to script?
 13 then
 14   echo "Usage: `basename $0` filename"
 15   exit $E_BADARGS
 16 fi
 17 
 18 if [ -f "$1" ]       # Check if file exists.
 19 then
 20     file_name=$1
 21 else
 22     echo "File \"$1\" does not exist."
 23     exit $E_NOFILE
 24 fi
 25 # =================================================================
 26 
 27 MAXWIDTH=70          # Width to fold excessively long lines to.
 28 
 29 # ---------------------------------
 30 # A variable can hold a sed script.
 31 sedscript='s/^>//
 32 s/^  *>//
 33 s/^  *//
 34 s/		*//'
 35 # ---------------------------------
 36 
 37 #  Delete carets and tabs at beginning of lines,
 38 #+ then fold lines to $MAXWIDTH characters.
 39 sed "$sedscript" $1 | fold -s --width=$MAXWIDTH
 40                         #  -s option to "fold"
 41                         #+ breaks lines at whitespace, if possible.
 42 
 43 
 44 #  This script was inspired by an article in a well-known trade journal
 45 #+ extolling a 164K MS Windows utility with similar functionality.
 46 #
 47 #  An nice set of text processing utilities and an efficient
 48 #+ scripting language provide an alternative to bloated executables.
 49 
 50 exit 0</pre>

 |

* * *

* * *

**例子 A-2\. **rn**: 一个非常简单的文件重命名工具**

这个脚本是[例子 12-19](textproc.md#LOWERCASE)的一个修改版.

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 #
  3 # Very simpleminded filename "rename" utility (based on "lowercase.sh").
  4 #
  5 #  The "ren" utility, by Vladimir Lanin (lanin@csd2.nyu.edu),
  6 #+ does a much better job of this.
  7 
  8 
  9 ARGS=2
 10 E_BADARGS=65
 11 ONE=1                     # For getting singular/plural right (see below).
 12 
 13 if [ $# -ne "$ARGS" ]
 14 then
 15   echo "Usage: `basename $0` old-pattern new-pattern"
 16   # As in "rn gif jpg", which renames all gif files in working directory to jpg.
 17   exit $E_BADARGS
 18 fi
 19 
 20 number=0                  # Keeps track of how many files actually renamed.
 21 
 22 
 23 for filename in *$1*      #Traverse all matching files in directory.
 24 do
 25    if [ -f "$filename" ]  # If finds match...
 26    then
 27      fname=`basename $filename`            # Strip off path.
 28      n=`echo $fname | sed -e "s/$1/$2/"`   # Substitute new for old in filename.
 29      mv $fname $n                          # Rename.
 30      let "number += 1"
 31    fi
 32 done   
 33 
 34 if [ "$number" -eq "$ONE" ]                # For correct grammar.
 35 then
 36  echo "$number file renamed."
 37 else 
 38  echo "$number files renamed."
 39 fi 
 40 
 41 exit 0
 42 
 43 
 44 # Exercises:
 45 # ---------
 46 # What type of files will this not work on?
 47 # How can this be fixed?
 48 #
 49 #  Rewrite this script to process all the files in a directory
 50 #+ containing spaces in their names, and to rename them,
 51 #+ substituting an underscore for each space.</pre>

 |

* * *

* * *

**例子 A-3\. **blank-rename**: 重命名包含空白的文件名**

这是上一个脚本的简化版.

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # blank-rename.sh
  3 #
  4 # Substitutes underscores for blanks in all the filenames in a directory.
  5 
  6 ONE=1                     # For getting singular/plural right (see below).
  7 number=0                  # Keeps track of how many files actually renamed.
  8 FOUND=0                   # Successful return value.
  9 
 10 for filename in *         #Traverse all files in directory.
 11 do
 12      echo "$filename" | grep -q " "         #  Check whether filename
 13      if [ $? -eq $FOUND ]                   #+ contains space(s).
 14      then
 15        fname=$filename                      # Strip off path.
 16        n=`echo $fname | sed -e "s/ /_/g"`   # Substitute underscore for blank.
 17        mv "$fname" "$n"                     # Do the actual renaming.
 18        let "number += 1"
 19      fi
 20 done   
 21 
 22 if [ "$number" -eq "$ONE" ]                 # For correct grammar.
 23 then
 24  echo "$number file renamed."
 25 else 
 26  echo "$number files renamed."
 27 fi 
 28 
 29 exit 0</pre>

 |

* * *

* * *

**例子 A-4\. **encryptedpw**: 使用一个本地加密口令, 上传到一个ftp服务器.**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # Example "ex72.sh" modified to use encrypted password.
  4 
  5 #  Note that this is still rather insecure,
  6 #+ since the decrypted password is sent in the clear.
  7 #  Use something like "ssh" if this is a concern.
  8 
  9 E_BADARGS=65
 10 
 11 if [ -z "$1" ]
 12 then
 13   echo "Usage: `basename $0` filename"
 14   exit $E_BADARGS
 15 fi  
 16 
 17 Username=bozo           # Change to suit.
 18 pword=/home/bozo/secret/password_encrypted.file
 19 # File containing encrypted password.
 20 
 21 Filename=`basename $1`  # Strips pathname out of file name.
 22 
 23 Server="XXX"
 24 Directory="YYY"         # Change above to actual server name & directory.
 25 
 26 
 27 Password=`cruft <$pword`          # Decrypt password.
 28 #  Uses the author's own "cruft" file encryption package,
 29 #+ based on the classic "onetime pad" algorithm,
 30 #+ and obtainable from:
 31 #+ Primary-site:   ftp://ibiblio.org/pub/Linux/utils/file
 32 #+                 cruft-0.2.tar.gz [16k]
 33 
 34 
 35 ftp -n $Server <<End-Of-Session
 36 user $Username $Password
 37 binary
 38 bell
 39 cd $Directory
 40 put $Filename
 41 bye
 42 End-Of-Session
 43 # -n option to "ftp" disables auto-logon.
 44 # Note that "bell" rings 'bell' after each file transfer.
 45 
 46 exit 0</pre>

 |

* * *

* * *

**例子 A-5\. **copy-cd**: 拷贝一个数据CD**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # copy-cd.sh: copying a data CD
  3 
  4 CDROM=/dev/cdrom                           # CD ROM device
  5 OF=/home/bozo/projects/cdimage.iso         # output file
  6 #       /xxxx/xxxxxxx/                     Change to suit your system.
  7 BLOCKSIZE=2048
  8 SPEED=2                                    # May use higher speed if supported.
  9 DEVICE=cdrom
 10 # DEVICE="0,0"    on older versions of cdrecord.
 11 
 12 echo; echo "Insert source CD, but do *not* mount it."
 13 echo "Press ENTER when ready. "
 14 read ready                                 # Wait for input, $ready not used.
 15 
 16 echo; echo "Copying the source CD to $OF."
 17 echo "This may take a while. Please be patient."
 18 
 19 dd if=$CDROM of=$OF bs=$BLOCKSIZE          # Raw device copy.
 20 
 21 
 22 echo; echo "Remove data CD."
 23 echo "Insert blank CDR."
 24 echo "Press ENTER when ready. "
 25 read ready                                 # Wait for input, $ready not used.
 26 
 27 echo "Copying $OF to CDR."
 28 
 29 cdrecord -v -isosize speed=$SPEED dev=$DEVICE $OF
 30 # Uses Joerg Schilling's "cdrecord" package (see its docs).
 31 # http://www.fokus.gmd.de/nthp/employees/schilling/cdrecord.html
 32 
 33 
 34 echo; echo "Done copying $OF to CDR on device $CDROM."
 35 
 36 echo "Do you want to erase the image file (y/n)? "  # Probably a huge file.
 37 read answer
 38 
 39 case "$answer" in
 40 [yY]) rm -f $OF
 41       echo "$OF erased."
 42       ;;
 43 *)    echo "$OF not erased.";;
 44 esac
 45 
 46 echo
 47 
 48 # Exercise:
 49 # Change the above "case" statement to also accept "yes" and "Yes" as input.
 50 
 51 exit 0</pre>

 |

* * *

* * *

**例子 A-6\. Collatz序列**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # collatz.sh
  3 
  4 #  The notorious "hailstone" or Collatz series.
  5 #  -------------------------------------------
  6 #  1) Get the integer "seed" from the command line.
  7 #  2) NUMBER <--- seed
  8 #  3) Print NUMBER.
  9 #  4)  If NUMBER is even, divide by 2, or
 10 #  5)+ if odd, multiply by 3 and add 1.
 11 #  6) NUMBER <--- result 
 12 #  7) Loop back to step 3 (for specified number of iterations).
 13 #
 14 #  The theory is that every sequence,
 15 #+ no matter how large the initial value,
 16 #+ eventually settles down to repeating "4,2,1..." cycles,
 17 #+ even after fluctuating through a wide range of values.
 18 #
 19 #  This is an instance of an "iterate",
 20 #+ an operation that feeds its output back into the input.
 21 #  Sometimes the result is a "chaotic" series.
 22 
 23 
 24 MAX_ITERATIONS=200
 25 # For large seed numbers (>32000), increase MAX_ITERATIONS.
 26 
 27 h=${1:-$}                      #  Seed
 28                                 #  Use $PID as seed,
 29                                 #+ if not specified as command-line arg.
 30 
 31 echo
 32 echo "C($h) --- $MAX_ITERATIONS Iterations"
 33 echo
 34 
 35 for ((i=1; i<=MAX_ITERATIONS; i++))
 36 do
 37 
 38 echo -n "$h	"
 39 #          ^^^^^
 40 #           tab
 41 
 42   let "remainder = h % 2"
 43   if [ "$remainder" -eq 0 ]   # Even?
 44   then
 45     let "h /= 2"              # Divide by 2.
 46   else
 47     let "h = h*3 + 1"         # Multiply by 3 and add 1.
 48   fi
 49 
 50 
 51 COLUMNS=10                    # Output 10 values per line.
 52 let "line_break = i % $COLUMNS"
 53 if [ "$line_break" -eq 0 ]
 54 then
 55   echo
 56 fi  
 57 
 58 done
 59 
 60 echo
 61 
 62 #  For more information on this mathematical function,
 63 #+ see "Computers, Pattern, Chaos, and Beauty", by Pickover, p. 185 ff.,
 64 #+ as listed in the bibliography.
 65 
 66 exit 0</pre>

 |

* * *

* * *

**例子 A-7\. **days-between**: 计算两个日期之间天数差**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # days-between.sh:    Number of days between two dates.
  3 # Usage: ./days-between.sh [M]M/[D]D/YYYY [M]M/[D]D/YYYY
  4 #
  5 # Note: Script modified to account for changes in Bash 2.05b
  6 #+      that closed the loophole permitting large negative
  7 #+      integer return values.
  8 
  9 ARGS=2                # Two command line parameters expected.
 10 E_PARAM_ERR=65        # Param error.
 11 
 12 REFYR=1600            # Reference year.
 13 CENTURY=100
 14 DIY=365
 15 ADJ_DIY=367           # Adjusted for leap year + fraction.
 16 MIY=12
 17 DIM=31
 18 LEAPCYCLE=4
 19 
 20 MAXRETVAL=255         #  Largest permissable
 21                       #+ positive return value from a function.
 22 
 23 diff=                 # Declare global variable for date difference.
 24 value=                # Declare global variable for absolute value.
 25 day=                  # Declare globals for day, month, year.
 26 month=
 27 year=
 28 
 29 
 30 Param_Error ()        # Command line parameters wrong.
 31 {
 32   echo "Usage: `basename $0` [M]M/[D]D/YYYY [M]M/[D]D/YYYY"
 33   echo "       (date must be after 1/3/1600)"
 34   exit $E_PARAM_ERR
 35 }  
 36 
 37 
 38 Parse_Date ()                 # Parse date from command line params.
 39 {
 40   month=${1%%/**}
 41   dm=${1%/**}                 # Day and month.
 42   day=${dm#*/}
 43   let "year = `basename $1`"  # Not a filename, but works just the same.
 44 }  
 45 
 46 
 47 check_date ()                 # Checks for invalid date(s) passed.
 48 {
 49   [ "$day" -gt "$DIM" ] || [ "$month" -gt "$MIY" ] || [ "$year" -lt "$REFYR" ] && Param_Error
 50   # Exit script on bad value(s).
 51   # Uses "or-list / and-list".
 52   #
 53   # Exercise: Implement more rigorous date checking.
 54 }
 55 
 56 
 57 strip_leading_zero () #  Better to strip possible leading zero(s)
 58 {                     #+ from day and/or month
 59   return ${1#0}       #+ since otherwise Bash will interpret them
 60 }                     #+ as octal values (POSIX.2, sect 2.9.2.1).
 61 
 62 
 63 day_index ()          # Gauss' Formula:
 64 {                     # Days from Jan. 3, 1600 to date passed as param.
 65 
 66   day=$1
 67   month=$2
 68   year=$3
 69 
 70   let "month = $month - 2"
 71   if [ "$month" -le 0 ]
 72   then
 73     let "month += 12"
 74     let "year -= 1"
 75   fi  
 76 
 77   let "year -= $REFYR"
 78   let "indexyr = $year / $CENTURY"
 79 
 80 
 81   let "Days = $DIY*$year + $year/$LEAPCYCLE - $indexyr + $indexyr/$LEAPCYCLE + $ADJ_DIY*$month/$MIY + $day - $DIM"
 82   #  For an in-depth explanation of this algorithm, see
 83   #+ http://home.t-online.de/home/berndt.schwerdtfeger/cal.htm
 84 
 85 
 86   echo $Days
 87 
 88 }  
 89 
 90 
 91 calculate_difference ()            # Difference between to day indices.
 92 {
 93   let "diff = $1 - $2"             # Global variable.
 94 }  
 95 
 96 
 97 abs ()                             #  Absolute value
 98 {                                  #  Uses global "value" variable.
 99   if [ "$1" -lt 0 ]                #  If negative
100   then                             #+ then
101     let "value = 0 - $1"           #+ change sign,
102   else                             #+ else
103     let "value = $1"               #+ leave it alone.
104   fi
105 }
106 
107 
108 
109 if [ $# -ne "$ARGS" ]              # Require two command line params.
110 then
111   Param_Error
112 fi  
113 
114 Parse_Date $1
115 check_date $day $month $year       #  See if valid date.
116 
117 strip_leading_zero $day            #  Remove any leading zeroes
118 day=$?                             #+ on day and/or month.
119 strip_leading_zero $month
120 month=$?
121 
122 let "date1 = `day_index $day $month $year`"
123 
124 
125 Parse_Date $2
126 check_date $day $month $year
127 
128 strip_leading_zero $day
129 day=$?
130 strip_leading_zero $month
131 month=$?
132 
133 date2=$(day_index $day $month $year) # Command substitution.
134 
135 
136 calculate_difference $date1 $date2
137 
138 abs $diff                            # Make sure it's positive.
139 diff=$value
140 
141 echo $diff
142 
143 exit 0
144 #  Compare this script with
145 #+ the implementation of Gauss' Formula in a C program at:
146 #+    http://buschencrew.hypermart.net/software/datedif</pre>

 |

* * *

* * *

**例子 A-8\. 构造一个<span class="QUOTE">"字典"</span>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # makedict.sh  [make dictionary]
  3 
  4 # Modification of /usr/sbin/mkdict script.
  5 # Original script copyright 1993, by Alec Muffett.
  6 #
  7 #  This modified script included in this document in a manner
  8 #+ consistent with the "LICENSE" document of the "Crack" package
  9 #+ that the original script is a part of.
 10 
 11 #  This script processes text files to produce a sorted list
 12 #+ of words found in the files.
 13 #  This may be useful for compiling dictionaries
 14 #+ and for lexicographic research.
 15 
 16 
 17 E_BADARGS=65
 18 
 19 if [ ! -r "$1" ]                     #  Need at least one
 20 then                                 #+ valid file argument.
 21   echo "Usage: $0 files-to-process"
 22   exit $E_BADARGS
 23 fi  
 24 
 25 
 26 # SORT="sort"                        #  No longer necessary to define options
 27                                      #+ to sort. Changed from original script.
 28 
 29 cat $* |                             # Contents of specified files to stdout.
 30         tr A-Z a-z |                 # Convert to lowercase.
 31         tr ' ' '\012' |              # New: change spaces to newlines.
 32 #       tr -cd '\012[a-z][0-9]' |    #  Get rid of everything non-alphanumeric
 33                                      #+ (original script).
 34         tr -c '\012a-z'  '\012' |    #  Rather than deleting
 35                                      #+ now change non-alpha to newlines.
 36         sort |                       # $SORT options unnecessary now.
 37         uniq |                       # Remove duplicates.
 38         grep -v '^#' |               # Delete lines beginning with a hashmark.
 39         grep -v '^/pre>                 # Delete blank lines.
 40 
 41 exit 0	</pre>

 |

* * *

* * *

**例子 A-9\. Soundex转换**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # soundex.sh: Calculate "soundex" code for names
  3 
  4 # =======================================================
  5 #        Soundex script
  6 #              by
  7 #         Mendel Cooper
  8 #     thegrendel@theriver.com
  9 #       23 January, 2002
 10 #
 11 #   Placed in the Public Domain.
 12 #
 13 # A slightly different version of this script appeared in
 14 #+ Ed Schaefer's July, 2002 "Shell Corner" column
 15 #+ in "Unix Review" on-line,
 16 #+ http://www.unixreview.com/documents/uni1026336632258/
 17 # =======================================================
 18 
 19 
 20 ARGCOUNT=1                     # Need name as argument.
 21 E_WRONGARGS=70
 22 
 23 if [ $# -ne "$ARGCOUNT" ]
 24 then
 25   echo "Usage: `basename $0` name"
 26   exit $E_WRONGARGS
 27 fi  
 28 
 29 
 30 assign_value ()                #  Assigns numerical value
 31 {                              #+ to letters of name.
 32 
 33   val1=bfpv                    # 'b,f,p,v' = 1
 34   val2=cgjkqsxz                # 'c,g,j,k,q,s,x,z' = 2
 35   val3=dt                      #  etc.
 36   val4=l
 37   val5=mn
 38   val6=r
 39 
 40 # Exceptionally clever use of 'tr' follows.
 41 # Try to figure out what is going on here.
 42 
 43 value=$( echo "$1" \
 44 | tr -d wh \
 45 | tr $val1 1 | tr $val2 2 | tr $val3 3 \
 46 | tr $val4 4 | tr $val5 5 | tr $val6 6 \
 47 | tr -s 123456 \
 48 | tr -d aeiouy )
 49 
 50 # Assign letter values.
 51 # Remove duplicate numbers, except when separated by vowels.
 52 # Ignore vowels, except as separators, so delete them last.
 53 # Ignore 'w' and 'h', even as separators, so delete them first.
 54 #
 55 # The above command substitution lays more pipe than a plumber <g>.
 56 
 57 }  
 58 
 59 
 60 input_name="$1"
 61 echo
 62 echo "Name = $input_name"
 63 
 64 
 65 # Change all characters of name input to lowercase.
 66 # ------------------------------------------------
 67 name=$( echo $input_name | tr A-Z a-z )
 68 # ------------------------------------------------
 69 # Just in case argument to script is mixed case.
 70 
 71 
 72 # Prefix of soundex code: first letter of name.
 73 # --------------------------------------------
 74 
 75 
 76 char_pos=0                     # Initialize character position. 
 77 prefix0=${name:$char_pos:1}
 78 prefix=`echo $prefix0 | tr a-z A-Z`
 79                                # Uppercase 1st letter of soundex.
 80 
 81 let "char_pos += 1"            # Bump character position to 2nd letter of name.
 82 name1=${name:$char_pos}
 83 
 84 
 85 # ++++++++++++++++++++++++++ Exception Patch +++++++++++++++++++++++++++++++++
 86 #  Now, we run both the input name and the name shifted one char to the right
 87 #+ through the value-assigning function.
 88 #  If we get the same value out, that means that the first two characters
 89 #+ of the name have the same value assigned, and that one should cancel.
 90 #  However, we also need to test whether the first letter of the name
 91 #+ is a vowel or 'w' or 'h', because otherwise this would bollix things up.
 92 
 93 char1=`echo $prefix | tr A-Z a-z`    # First letter of name, lowercased.
 94 
 95 assign_value $name
 96 s1=$value
 97 assign_value $name1
 98 s2=$value
 99 assign_value $char1
100 s3=$value
101 s3=9$s3                              #  If first letter of name is a vowel
102                                      #+ or 'w' or 'h',
103                                      #+ then its "value" will be null (unset).
104 				     #+ Therefore, set it to 9, an otherwise
105 				     #+ unused value, which can be tested for.
106 
107 
108 if [[ "$s1" -ne "$s2" || "$s3" -eq 9 ]]
109 then
110   suffix=$s2
111 else  
112   suffix=${s2:$char_pos}
113 fi  
114 # ++++++++++++++++++++++ end Exception Patch +++++++++++++++++++++++++++++++++
115 
116 
117 padding=000                    # Use at most 3 zeroes to pad.
118 
119 
120 soun=$prefix$suffix$padding    # Pad with zeroes.
121 
122 MAXLEN=4                       # Truncate to maximum of 4 chars.
123 soundex=${soun:0:$MAXLEN}
124 
125 echo "Soundex = $soundex"
126 
127 echo
128 
129 #  The soundex code is a method of indexing and classifying names
130 #+ by grouping together the ones that sound alike.
131 #  The soundex code for a given name is the first letter of the name,
132 #+ followed by a calculated three-number code.
133 #  Similar sounding names should have almost the same soundex codes.
134 
135 #   Examples:
136 #   Smith and Smythe both have a "S-530" soundex.
137 #   Harrison = H-625
138 #   Hargison = H-622
139 #   Harriman = H-655
140 
141 #  This works out fairly well in practice, but there are numerous anomalies.
142 #
143 #
144 #  The U.S. Census and certain other governmental agencies use soundex,
145 #  as do genealogical researchers.
146 #
147 #  For more information,
148 #+ see the "National Archives and Records Administration home page",
149 #+ http://www.nara.gov/genealogy/soundex/soundex.html
150 
151 
152 
153 # Exercise:
154 # --------
155 # Simplify the "Exception Patch" section of this script.
156 
157 exit 0</pre>

 |

* * *

* * *

**例子 A-10\. <span class="QUOTE">"Game of Life"</span>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # life.sh: "Life in the Slow Lane"
  3 # Version 2: Patched by Daniel Albers
  4 #+           to allow non-square grids as input.
  5 
  6 # ##################################################################### #
  7 # This is the Bash script version of John Conway's "Game of Life".      #
  8 # "Life" is a simple implementation of cellular automata.               #
  9 # --------------------------------------------------------------------- #
 10 # On a rectangular grid, let each "cell" be either "living" or "dead".  #
 11 # Designate a living cell with a dot, and a dead one with a blank space.#
 12 #  Begin with an arbitrarily drawn dot-and-blank grid,                  #
 13 #+ and let this be the starting generation, "generation 0".             #
 14 # Determine each successive generation by the following rules:          #
 15 # 1) Each cell has 8 neighbors, the adjoining cells                     #
 16 #+   left, right, top, bottom, and the 4 diagonals.                     #
 17 #                       123                                             #
 18 #                       4*5                                             #
 19 #                       678                                             #
 20 #                                                                       #
 21 # 2) A living cell with either 2 or 3 living neighbors remains alive.   #
 22 # 3) A dead cell with 3 living neighbors becomes alive (a "birth").     #
 23 SURVIVE=2                                                               #
 24 BIRTH=3                                                                 #
 25 # 4) All other cases result in a dead cell for the next generation.     #
 26 # ##################################################################### #
 27 
 28 
 29 startfile=gen0   # Read the starting generation from the file "gen0".
 30                  # Default, if no other file specified when invoking script.
 31                  #
 32 if [ -n "$1" ]   # Specify another "generation 0" file.
 33 then
 34     startfile="$1"
 35 fi  
 36 
 37 ############################################
 38 #  Abort script if "startfile" not specified
 39 #+ AND
 40 #+ "gen0" not present.
 41 
 42 E_NOSTARTFILE=68
 43 
 44 if [ ! -e "$startfile" ]
 45 then
 46   echo "Startfile \""$startfile"\" missing!"
 47   exit $E_NOSTARTFILE
 48 fi
 49 ############################################
 50 
 51 
 52 ALIVE1=.
 53 DEAD1=_
 54                  # Represent living and "dead" cells in the start-up file.
 55 
 56 #  ---------------------------------------------------------- #
 57 #  This script uses a 10 x 10 grid (may be increased,
 58 #+ but a large grid will will cause very slow execution).
 59 ROWS=10
 60 COLS=10
 61 #  Change above two variables to match grid size, if necessary.
 62 #  ---------------------------------------------------------- #
 63 
 64 GENERATIONS=10          #  How many generations to cycle through.
 65                         #  Adjust this upwards,
 66                         #+ if you have time on your hands.
 67 
 68 NONE_ALIVE=80           #  Exit status on premature bailout,
 69                         #+ if no cells left alive.
 70 TRUE=0
 71 FALSE=1
 72 ALIVE=0
 73 DEAD=1
 74 
 75 avar=                   # Global; holds current generation.
 76 generation=0            # Initialize generation count.
 77 
 78 # =================================================================
 79 
 80 
 81 let "cells = $ROWS * $COLS"
 82                         # How many cells.
 83 
 84 declare -a initial      # Arrays containing "cells".
 85 declare -a current
 86 
 87 display ()
 88 {
 89 
 90 alive=0                 # How many cells "alive" at any given time.
 91                         # Initially zero.
 92 
 93 declare -a arr
 94 arr=( `echo "$1"` )     # Convert passed arg to array.
 95 
 96 element_count=${#arr[*]}
 97 
 98 local i
 99 local rowcheck
100 
101 for ((i=0; i<$element_count; i++))
102 do
103 
104   # Insert newline at end of each row.
105   let "rowcheck = $i % COLS"
106   if [ "$rowcheck" -eq 0 ]
107   then
108     echo                # Newline.
109     echo -n "      "    # Indent.
110   fi  
111 
112   cell=${arr[i]}
113 
114   if [ "$cell" = . ]
115   then
116     let "alive += 1"
117   fi  
118 
119   echo -n "$cell" | sed -e 's/_/ /g'
120   # Print out array and change underscores to spaces.
121 done  
122 
123 return
124 
125 }
126 
127 IsValid ()                            # Test whether cell coordinate valid.
128 {
129 
130   if [ -z "$1"  -o -z "$2" ]          # Mandatory arguments missing?
131   then
132     return $FALSE
133   fi
134 
135 local row
136 local lower_limit=0                   # Disallow negative coordinate.
137 local upper_limit
138 local left
139 local right
140 
141 let "upper_limit = $ROWS * $COLS - 1" # Total number of cells.
142 
143 
144 if [ "$1" -lt "$lower_limit" -o "$1" -gt "$upper_limit" ]
145 then
146   return $FALSE                       # Out of array bounds.
147 fi  
148 
149 row=$2
150 let "left = $row * $COLS"             # Left limit.
151 let "right = $left + $COLS - 1"       # Right limit.
152 
153 if [ "$1" -lt "$left" -o "$1" -gt "$right" ]
154 then
155   return $FALSE                       # Beyond row boundary.
156 fi  
157 
158 return $TRUE                          # Valid coordinate.
159 
160 }  
161 
162 
163 IsAlive ()              # Test whether cell is alive.
164                         # Takes array, cell number, state of cell as arguments.
165 {
166   GetCount "$1" $2      # Get alive cell count in neighborhood.
167   local nhbd=$?
168 
169 
170   if [ "$nhbd" -eq "$BIRTH" ]  # Alive in any case.
171   then
172     return $ALIVE
173   fi
174 
175   if [ "$3" = "." -a "$nhbd" -eq "$SURVIVE" ]
176   then                  # Alive only if previously alive.
177     return $ALIVE
178   fi  
179 
180   return $DEAD          # Default.
181 
182 }  
183 
184 
185 GetCount ()             # Count live cells in passed cell's neighborhood.
186                         # Two arguments needed:
187 			# $1) variable holding array
188 			# $2) cell number
189 {
190   local cell_number=$2
191   local array
192   local top
193   local center
194   local bottom
195   local r
196   local row
197   local i
198   local t_top
199   local t_cen
200   local t_bot
201   local count=0
202   local ROW_NHBD=3
203 
204   array=( `echo "$1"` )
205 
206   let "top = $cell_number - $COLS - 1"    # Set up cell neighborhood.
207   let "center = $cell_number - 1"
208   let "bottom = $cell_number + $COLS - 1"
209   let "r = $cell_number / $COLS"
210 
211   for ((i=0; i<$ROW_NHBD; i++))           # Traverse from left to right. 
212   do
213     let "t_top = $top + $i"
214     let "t_cen = $center + $i"
215     let "t_bot = $bottom + $i"
216 
217 
218     let "row = $r"                        # Count center row of neighborhood.
219     IsValid $t_cen $row                   # Valid cell position?
220     if [ $? -eq "$TRUE" ]
221     then
222       if [ ${array[$t_cen]} = "$ALIVE1" ] # Is it alive?
223       then                                # Yes?
224         let "count += 1"                  # Increment count.
225       fi	
226     fi  
227 
228     let "row = $r - 1"                    # Count top row.          
229     IsValid $t_top $row
230     if [ $? -eq "$TRUE" ]
231     then
232       if [ ${array[$t_top]} = "$ALIVE1" ] 
233       then
234         let "count += 1"
235       fi	
236     fi  
237 
238     let "row = $r + 1"                    # Count bottom row.
239     IsValid $t_bot $row
240     if [ $? -eq "$TRUE" ]
241     then
242       if [ ${array[$t_bot]} = "$ALIVE1" ] 
243       then
244         let "count += 1"
245       fi	
246     fi  
247 
248   done  
249 
250 
251   if [ ${array[$cell_number]} = "$ALIVE1" ]
252   then
253     let "count -= 1"        #  Make sure value of tested cell itself
254   fi                        #+ is not counted.
255 
256 
257   return $count
258   
259 }
260 
261 next_gen ()               # Update generation array.
262 {
263 
264 local array
265 local i=0
266 
267 array=( `echo "$1"` )     # Convert passed arg to array.
268 
269 while [ "$i" -lt "$cells" ]
270 do
271   IsAlive "$1" $i ${array[$i]}   # Is cell alive?
272   if [ $? -eq "$ALIVE" ]
273   then                           #  If alive, then
274     array[$i]=.                  #+ represent the cell as a period.
275   else  
276     array[$i]="_"                #  Otherwise underscore
277    fi                            #+ (which will later be converted to space).  
278   let "i += 1" 
279 done   
280 
281 
282 # let "generation += 1"   # Increment generation count.
283 # Why was the above line commented out?
284 
285 
286 # Set variable to pass as parameter to "display" function.
287 avar=`echo ${array[@]}`   # Convert array back to string variable.
288 display "$avar"           # Display it.
289 echo; echo
290 echo "Generation $generation  -  $alive alive"
291 
292 if [ "$alive" -eq 0 ]
293 then
294   echo
295   echo "Premature exit: no more cells alive!"
296   exit $NONE_ALIVE        #  No point in continuing
297 fi                        #+ if no live cells.
298 
299 }
300 
301 
302 # =========================================================
303 
304 # main ()
305 
306 # Load initial array with contents of startup file.
307 initial=( `cat "$startfile" | sed -e '/#/d' | tr -d '\n' |\
308 sed -e 's/\./\. /g' -e 's/_/_ /g'` )
309 # Delete lines containing '#' comment character.
310 # Remove linefeeds and insert space between elements.
311 
312 clear          # Clear screen.
313 
314 echo #         Title
315 echo "======================="
316 echo "    $GENERATIONS generations"
317 echo "           of"
318 echo "\"Life in the Slow Lane\""
319 echo "======================="
320 
321 
322 # -------- Display first generation. --------
323 Gen0=`echo ${initial[@]}`
324 display "$Gen0"           # Display only.
325 echo; echo
326 echo "Generation $generation  -  $alive alive"
327 # -------------------------------------------
328 
329 
330 let "generation += 1"     # Increment generation count.
331 echo
332 
333 # ------- Display second generation. -------
334 Cur=`echo ${initial[@]}`
335 next_gen "$Cur"          # Update & display.
336 # ------------------------------------------
337 
338 let "generation += 1"     # Increment generation count.
339 
340 # ------ Main loop for displaying subsequent generations ------
341 while [ "$generation" -le "$GENERATIONS" ]
342 do
343   Cur="$avar"
344   next_gen "$Cur"
345   let "generation += 1"
346 done
347 # ==============================================================
348 
349 echo
350 
351 exit 0   # END
352 
353 
354 
355 # The grid in this script has a "boundary problem."
356 # The the top, bottom, and sides border on a void of dead cells.
357 # Exercise: Change the script to have the grid wrap around,
358 # +         so that the left and right sides will "touch,"      
359 # +         as will the top and bottom.
360 #
361 # Exercise: Create a new "gen0" file to seed this script.
362 #           Use a 12 x 16 grid, instead of the original 10 x 10 one.
363 #           Make the necessary changes to the script,
364 #+          so it will run with the altered file.
365 #
366 # Exercise: Modify this script so that it can determine the grid size
367 #+          from the "gen0" file, and set any variables necessary
368 #+          for the script to run.
369 #           This would make unnecessary any changes to variables
370 #+          in the script for an altered grid size.</pre>

 |

* * *

* * *

**例子 A-11\. <span class="QUOTE">"Game of Life"</span>的数据文件**

| 

<pre class="PROGRAMLISTING">  1 # This is an example "generation 0" start-up file for "life.sh".
  2 # --------------------------------------------------------------
  3 #  The "gen0" file is a 10 x 10 grid using a period (.) for live cells,
  4 #+ and an underscore (_) for dead ones. We cannot simply use spaces
  5 #+ for dead cells in this file because of a peculiarity in Bash arrays.
  6 #  [Exercise for the reader: explain this.]
  7 #
  8 # Lines beginning with a '#' are comments, and the script ignores them.
  9 __.__..___
 10 ___._.____
 11 ____.___..
 12 _._______.
 13 ____._____
 14 ..__...___
 15 ____._____
 16 ___...____
 17 __.._..___
 18 _..___..__</pre>

 |

* * *

+++

下面的两个脚本是由多伦多大学的Mark Moraes编写的. 请参考附件文件<span class="QUOTE">"Moraes-COPYRIGHT"</span>, 详细的指明了授权与约定.

* * *

**例子 A-12\. **behead**: 去掉信件与新消息的头**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/sh
  2 # Strips off the header from a mail/News message i.e. till the first
  3 # empty line
  4 # Mark Moraes, University of Toronto
  5 
  6 # ==> These comments added by author of this document.
  7 
  8 if [ $# -eq 0 ]; then
  9 # ==> If no command line args present, then works on file redirected to stdin.
 10 	sed -e '1,/^$/d' -e '/^[ 	]*$/d'
 11 	# --> Delete empty lines and all lines until 
 12 	# --> first one beginning with white space.
 13 else
 14 # ==> If command line args present, then work on files named.
 15 	for i do
 16 		sed -e '1,/^$/d' -e '/^[ 	]*$/d' $i
 17 		# --> Ditto, as above.
 18 	done
 19 fi
 20 
 21 # ==> Exercise: Add error checking and other options.
 22 # ==>
 23 # ==> Note that the small sed script repeats, except for the arg passed.
 24 # ==> Does it make sense to embed it in a function? Why or why not?</pre>

 |

* * *

* * *

**例子 A-13\. **ftpget**: 通过ftp下载文件**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/sh 
  2 # $Id: ftpget,v 1.2 91/05/07 21:15:43 moraes Exp $ 
  3 # Script to perform batch anonymous ftp. Essentially converts a list of
  4 # of command line arguments into input to ftp.
  5 # ==> This script is nothing but a shell wrapper around "ftp" . . .
  6 # Simple, and quick - written as a companion to ftplist 
  7 # -h specifies the remote host (default prep.ai.mit.edu) 
  8 # -d specifies the remote directory to cd to - you can provide a sequence 
  9 # of -d options - they will be cd'ed to in turn. If the paths are relative, 
 10 # make sure you get the sequence right. Be careful with relative paths - 
 11 # there are far too many symlinks nowadays.  
 12 # (default is the ftp login directory)
 13 # -v turns on the verbose option of ftp, and shows all responses from the 
 14 # ftp server.  
 15 # -f remotefile[:localfile] gets the remote file into localfile 
 16 # -m pattern does an mget with the specified pattern. Remember to quote 
 17 # shell characters.  
 18 # -c does a local cd to the specified directory
 19 # For example, 
 20 # 	ftpget -h expo.lcs.mit.edu -d contrib -f xplaces.shar:xplaces.sh \
 21 #		-d ../pub/R3/fixes -c ~/fixes -m 'fix*' 
 22 # will get xplaces.shar from ~ftp/contrib on expo.lcs.mit.edu, and put it in
 23 # xplaces.sh in the current working directory, and get all fixes from
 24 # ~ftp/pub/R3/fixes and put them in the ~/fixes directory. 
 25 # Obviously, the sequence of the options is important, since the equivalent
 26 # commands are executed by ftp in corresponding order
 27 #
 28 # Mark Moraes <moraes@csri.toronto.edu>, Feb 1, 1989 
 29 #
 30 
 31 
 32 # ==> These comments added by author of this document.
 33 
 34 # PATH=/local/bin:/usr/ucb:/usr/bin:/bin
 35 # export PATH
 36 # ==> Above 2 lines from original script probably superfluous.
 37 
 38 E_BADARGS=65
 39 
 40 TMPFILE=/tmp/ftp.$
 41 # ==> Creates temp file, using process id of script ($)
 42 # ==> to construct filename.
 43 
 44 SITE=`domainname`.toronto.edu
 45 # ==> 'domainname' similar to 'hostname'
 46 # ==> May rewrite this to parameterize this for general use.
 47 
 48 usage="Usage: $0 [-h remotehost] [-d remotedirectory]... [-f remfile:localfile]... \
 49 		[-c localdirectory] [-m filepattern] [-v]"
 50 ftpflags="-i -n"
 51 verbflag=
 52 set -f 		# So we can use globbing in -m
 53 set x `getopt vh:d:c:m:f: $*`
 54 if [ $? != 0 ]; then
 55 	echo $usage
 56 	exit $E_BADARGS
 57 fi
 58 shift
 59 trap 'rm -f ${TMPFILE} ; exit' 0 1 2 3 15
 60 # ==> Delete tempfile in case of abnormal exit from script.
 61 echo "user anonymous ${USER-gnu}@${SITE} > ${TMPFILE}"
 62 # ==> Added quotes (recommended in complex echoes).
 63 echo binary >> ${TMPFILE}
 64 for i in $*   # ==> Parse command line args.
 65 do
 66 	case $i in
 67 	-v) verbflag=-v; echo hash >> ${TMPFILE}; shift;;
 68 	-h) remhost=$2; shift 2;;
 69 	-d) echo cd $2 >> ${TMPFILE}; 
 70 	    if [ x${verbflag} != x ]; then
 71 	        echo pwd >> ${TMPFILE};
 72 	    fi;
 73 	    shift 2;;
 74 	-c) echo lcd $2 >> ${TMPFILE}; shift 2;;
 75 	-m) echo mget "$2" >> ${TMPFILE}; shift 2;;
 76 	-f) f1=`expr "$2" : "\([^:]*\).*"`; f2=`expr "$2" : "[^:]*:\(.*\)"`;
 77 	    echo get ${f1} ${f2} >> ${TMPFILE}; shift 2;;
 78 	--) shift; break;;
 79 	esac
 80         # ==> 'lcd' and 'mget' are ftp commands. See "man ftp" . . .
 81 done
 82 if [ $# -ne 0 ]; then
 83 	echo $usage
 84 	exit $E_BADARGS
 85         # ==> Changed from "exit 2" to conform with style standard.
 86 fi
 87 if [ x${verbflag} != x ]; then
 88 	ftpflags="${ftpflags} -v"
 89 fi
 90 if [ x${remhost} = x ]; then
 91 	remhost=prep.ai.mit.edu
 92 	# ==> Change to match appropriate ftp site.
 93 fi
 94 echo quit >> ${TMPFILE}
 95 # ==> All commands saved in tempfile.
 96 
 97 ftp ${ftpflags} ${remhost} < ${TMPFILE}
 98 # ==> Now, tempfile batch processed by ftp.
 99 
100 rm -f ${TMPFILE}
101 # ==> Finally, tempfile deleted (you may wish to copy it to a logfile).
102 
103 
104 # ==> Exercises:
105 # ==> ---------
106 # ==> 1) Add error checking.
107 # ==> 2) Add bells & whistles.</pre>

 |

* * *

+

Antek Sawicki捐献了下面的脚本, 这个脚本非常聪明的使用了参数替换操作符, 我们在[Section 9.3](parameter-substitution.md)中讨论了参数替换操作符.

* * *

**例子 A-14\. **password**: 产生随机的8个字符的密码**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # May need to be invoked with  #!/bin/bash2  on older machines.
  3 #
  4 # Random password generator for Bash 2.x by Antek Sawicki <tenox@tenox.tc>,
  5 # who generously gave permission to the document author to use it here.
  6 #
  7 # ==> Comments added by document author ==>
  8 
  9 
 10 MATRIX="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
 11 # ==> Password will consist of alphanumeric characters.
 12 LENGTH="8"
 13 # ==> May change 'LENGTH' for longer password.
 14 
 15 
 16 while [ "${n:=1}" -le "$LENGTH" ]
 17 # ==> Recall that := is "default substitution" operator.
 18 # ==> So, if 'n' has not been initialized, set it to 1.
 19 do
 20 	PASS="$PASS${MATRIX:$(($RANDOM%${#MATRIX})):1}"
 21 	# ==> Very clever, but tricky.
 22 
 23 	# ==> Starting from the innermost nesting...
 24 	# ==> ${#MATRIX} returns length of array MATRIX.
 25 
 26 	# ==> $RANDOM%${#MATRIX} returns random number between 1
 27 	# ==> and [length of MATRIX] - 1.
 28 
 29 	# ==> ${MATRIX:$(($RANDOM%${#MATRIX})):1}
 30 	# ==> returns expansion of MATRIX at random position, by length 1\. 
 31 	# ==> See {var:pos:len} parameter substitution in Chapter 9.
 32 	# ==> and the associated examples.
 33 
 34 	# ==> PASS=... simply pastes this result onto previous PASS (concatenation).
 35 
 36 	# ==> To visualize this more clearly, uncomment the following line
 37 	#                 echo "$PASS"
 38 	# ==> to see PASS being built up,
 39 	# ==> one character at a time, each iteration of the loop.
 40 
 41 	let n+=1
 42 	# ==> Increment 'n' for next pass.
 43 done
 44 
 45 echo "$PASS"      # ==> Or, redirect to a file, as desired.
 46 
 47 exit 0</pre>

 |

* * *

+

James R. Van Zandt捐献了这个脚本, 使用命名管道, 用他的话来说, <span class="QUOTE">"引用与转义的真正练习"</span>.

* * *

**例子 A-15\. **fifo**: 使用命名管道来做每日的备份**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ==> Script by James R. Van Zandt, and used here with his permission.
  3 
  4 # ==> Comments added by author of this document.
  5 
  6   
  7   HERE=`uname -n`    # ==> hostname
  8   THERE=bilbo
  9   echo "starting remote backup to $THERE at `date +%r`"
 10   # ==> `date +%r` returns time in 12-hour format, i.e. "08:08:34 PM".
 11   
 12   # make sure /pipe really is a pipe and not a plain file
 13   rm -rf /pipe
 14   mkfifo /pipe       # ==> Create a "named pipe", named "/pipe".
 15   
 16   # ==> 'su xyz' runs commands as user "xyz".
 17   # ==> 'ssh' invokes secure shell (remote login client).
 18   su xyz -c "ssh $THERE \"cat >/home/xyz/backup/${HERE}-daily.tar.gz\" < /pipe"&
 19   cd /
 20   tar -czf - bin boot dev etc home info lib man root sbin share usr var >/pipe
 21   # ==> Uses named pipe, /pipe, to communicate between processes:
 22   # ==> 'tar/gzip' writes to /pipe and 'ssh' reads from /pipe.
 23 
 24   # ==> The end result is this backs up the main directories, from / on down.
 25 
 26   # ==>  What are the advantages of a "named pipe" in this situation,
 27   # ==>+ as opposed to an "anonymous pipe", with |?
 28   # ==>  Will an anonymous pipe even work here?
 29 
 30 
 31   exit 0</pre>

 |

* * *

+

Stephane Chazelas捐献了这个脚本, 用来展示如何不使用数组来产生素数

* * *

**例子 A-16\. 使用模操作符来产生素数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # primes.sh: Generate prime numbers, without using arrays.
  3 # Script contributed by Stephane Chazelas.
  4 
  5 #  This does *not* use the classic "Sieve of Eratosthenes" algorithm,
  6 #+ but instead uses the more intuitive method of testing each candidate number
  7 #+ for factors (divisors), using the "%" modulo operator.
  8 
  9 
 10 LIMIT=1000                    # Primes 2 - 1000
 11 
 12 Primes()
 13 {
 14  (( n = $1 + 1 ))             # Bump to next integer.
 15  shift                        # Next parameter in list.
 16 #  echo "_n=$n i=$i_"
 17  
 18  if (( n == LIMIT ))
 19  then echo $*
 20  return
 21  fi
 22 
 23  for i; do                    # "i" gets set to "@", previous values of $n.
 24 #   echo "-n=$n i=$i-"
 25    (( i * i > n )) && break   # Optimization.
 26    (( n % i )) && continue    # Sift out non-primes using modulo operator.
 27    Primes $n $@               # Recursion inside loop.
 28    return
 29    done
 30 
 31    Primes $n $@ $n            # Recursion outside loop.
 32                               # Successively accumulate positional parameters.
 33                               # "$@" is the accumulating list of primes.
 34 }
 35 
 36 Primes 1
 37 
 38 exit 0
 39 
 40 #  Uncomment lines 16 and 24 to help figure out what is going on.
 41 
 42 #  Compare the speed of this algorithm for generating primes
 43 #+ with the Sieve of Eratosthenes (ex68.sh).
 44 
 45 #  Exercise: Rewrite this script without recursion, for faster execution.</pre>

 |

* * *

+

这是Jordi Sanfeliu的_tree_脚本的升级版, 由Rick Boivie编写.

* * *

**例子 A-17\. **tree**: 显示目录树**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # tree.sh
  3 
  4 #  Written by Rick Boivie.
  5 #  Used with permission.
  6 #  This is a revised and simplified version of a script
  7 #+ by Jordi Sanfeliu (and patched by Ian Kjos).
  8 #  This script replaces the earlier version used in
  9 #+ previous releases of the Advanced Bash Scripting Guide.
 10 
 11 # ==> Comments added by the author of this document.
 12 
 13 
 14 search () {
 15 for dir in `echo *`
 16 #  ==> `echo *` lists all the files in current working directory,
 17 #+ ==> without line breaks.
 18 #  ==> Similar effect to for dir in *
 19 #  ==> but "dir in `echo *`" will not handle filenames with blanks.
 20 do
 21   if [ -d "$dir" ] ; then # ==> If it is a directory (-d)...
 22   zz=0                    # ==> Temp variable, keeping track of directory level.
 23   while [ $zz != $1 ]     # Keep track of inner nested loop.
 24     do
 25       echo -n "| "        # ==> Display vertical connector symbol,
 26                           # ==> with 2 spaces & no line feed in order to indent.
 27       zz=`expr $zz + 1`   # ==> Increment zz.
 28     done
 29 
 30     if [ -L "$dir" ] ; then # ==> If directory is a symbolic link...
 31       echo "+---$dir" `ls -l $dir | sed 's/^.*'$dir' //'`
 32       # ==> Display horiz. connector and list directory name, but...
 33       # ==> delete date/time part of long listing.
 34     else
 35       echo "+---$dir"       # ==> Display horizontal connector symbol...
 36       # ==> and print directory name.
 37       numdirs=`expr $numdirs + 1` # ==> Increment directory count.
 38       if cd "$dir" ; then         # ==> If can move to subdirectory...
 39         search `expr $1 + 1`      # with recursion ;-)
 40         # ==> Function calls itself.
 41         cd ..
 42       fi
 43     fi
 44   fi
 45 done
 46 }
 47 
 48 if [ $# != 0 ] ; then
 49   cd $1 # move to indicated directory.
 50   #else # stay in current directory
 51 fi
 52 
 53 echo "Initial directory = `pwd`"
 54 numdirs=0
 55 
 56 search 0
 57 echo "Total directories = $numdirs"
 58 
 59 exit 0</pre>

 |

* * *

经过Noah Friedman的授权, 他的_string function_脚本可以在本书中使用, 这个脚本本质上就是复制了一些C库的字符串操作函数.

* * *

**例子 A-18\. **string functions**: C风格的字符串函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # string.bash --- bash emulation of string(3) library routines
  4 # Author: Noah Friedman <friedman@prep.ai.mit.edu>
  5 # ==>     Used with his kind permission in this document.
  6 # Created: 1992-07-01
  7 # Last modified: 1993-09-29
  8 # Public domain
  9 
 10 # Conversion to bash v2 syntax done by Chet Ramey
 11 
 12 # Commentary:
 13 # Code:
 14 
 15 #:docstring strcat:
 16 # Usage: strcat s1 s2
 17 #
 18 # Strcat appends the value of variable s2 to variable s1\. 
 19 #
 20 # Example:
 21 #    a="foo"
 22 #    b="bar"
 23 #    strcat a b
 24 #    echo $a
 25 #    => foobar
 26 #
 27 #:end docstring:
 28 
 29 ###;;;autoload   ==> Autoloading of function commented out.
 30 function strcat ()
 31 {
 32     local s1_val s2_val
 33 
 34     s1_val=${!1}                        # indirect variable expansion
 35     s2_val=${!2}
 36     eval "$1"=\'"${s1_val}${s2_val}"\'
 37     # ==> eval $1='${s1_val}${s2_val}' avoids problems,
 38     # ==> if one of the variables contains a single quote.
 39 }
 40 
 41 #:docstring strncat:
 42 # Usage: strncat s1 s2 $n
 43 # 
 44 # Line strcat, but strncat appends a maximum of n characters from the value
 45 # of variable s2\.  It copies fewer if the value of variabl s2 is shorter
 46 # than n characters.  Echoes result on stdout.
 47 #
 48 # Example:
 49 #    a=foo
 50 #    b=barbaz
 51 #    strncat a b 3
 52 #    echo $a
 53 #    => foobar
 54 #
 55 #:end docstring:
 56 
 57 ###;;;autoload
 58 function strncat ()
 59 {
 60     local s1="$1"
 61     local s2="$2"
 62     local -i n="$3"
 63     local s1_val s2_val
 64 
 65     s1_val=${!s1}                       # ==> indirect variable expansion
 66     s2_val=${!s2}
 67 
 68     if [ ${#s2_val} -gt ${n} ]; then
 69        s2_val=${s2_val:0:$n}            # ==> substring extraction
 70     fi
 71 
 72     eval "$s1"=\'"${s1_val}${s2_val}"\'
 73     # ==> eval $1='${s1_val}${s2_val}' avoids problems,
 74     # ==> if one of the variables contains a single quote.
 75 }
 76 
 77 #:docstring strcmp:
 78 # Usage: strcmp $s1 $s2
 79 #
 80 # Strcmp compares its arguments and returns an integer less than, equal to,
 81 # or greater than zero, depending on whether string s1 is lexicographically
 82 # less than, equal to, or greater than string s2.
 83 #:end docstring:
 84 
 85 ###;;;autoload
 86 function strcmp ()
 87 {
 88     [ "$1" = "$2" ] && return 0
 89 
 90     [ "${1}" '<' "${2}" ] > /dev/null && return -1
 91 
 92     return 1
 93 }
 94 
 95 #:docstring strncmp:
 96 # Usage: strncmp $s1 $s2 $n
 97 # 
 98 # Like strcmp, but makes the comparison by examining a maximum of n
 99 # characters (n less than or equal to zero yields equality).
100 #:end docstring:
101 
102 ###;;;autoload
103 function strncmp ()
104 {
105     if [ -z "${3}" -o "${3}" -le "0" ]; then
106        return 0
107     fi
108    
109     if [ ${3} -ge ${#1} -a ${3} -ge ${#2} ]; then
110        strcmp "$1" "$2"
111        return $?
112     else
113        s1=${1:0:$3}
114        s2=${2:0:$3}
115        strcmp $s1 $s2
116        return $?
117     fi
118 }
119 
120 #:docstring strlen:
121 # Usage: strlen s
122 #
123 # Strlen returns the number of characters in string literal s.
124 #:end docstring:
125 
126 ###;;;autoload
127 function strlen ()
128 {
129     eval echo "\${#${1}}"
130     # ==> Returns the length of the value of the variable
131     # ==> whose name is passed as an argument.
132 }
133 
134 #:docstring strspn:
135 # Usage: strspn $s1 $s2
136 # 
137 # Strspn returns the length of the maximum initial segment of string s1,
138 # which consists entirely of characters from string s2.
139 #:end docstring:
140 
141 ###;;;autoload
142 function strspn ()
143 {
144     # Unsetting IFS allows whitespace to be handled as normal chars. 
145     local IFS=
146     local result="${1%%[!${2}]*}"
147  
148     echo ${#result}
149 }
150 
151 #:docstring strcspn:
152 # Usage: strcspn $s1 $s2
153 #
154 # Strcspn returns the length of the maximum initial segment of string s1,
155 # which consists entirely of characters not from string s2.
156 #:end docstring:
157 
158 ###;;;autoload
159 function strcspn ()
160 {
161     # Unsetting IFS allows whitspace to be handled as normal chars. 
162     local IFS=
163     local result="${1%%[${2}]*}"
164  
165     echo ${#result}
166 }
167 
168 #:docstring strstr:
169 # Usage: strstr s1 s2
170 # 
171 # Strstr echoes a substring starting at the first occurrence of string s2 in
172 # string s1, or nothing if s2 does not occur in the string.  If s2 points to
173 # a string of zero length, strstr echoes s1.
174 #:end docstring:
175 
176 ###;;;autoload
177 function strstr ()
178 {
179     # if s2 points to a string of zero length, strstr echoes s1
180     [ ${#2} -eq 0 ] && { echo "$1" ; return 0; }
181 
182     # strstr echoes nothing if s2 does not occur in s1
183     case "$1" in
184     *$2*) ;;
185     *) return 1;;
186     esac
187 
188     # use the pattern matching code to strip off the match and everything
189     # following it
190     first=${1/$2*/}
191 
192     # then strip off the first unmatched portion of the string
193     echo "${1##$first}"
194 }
195 
196 #:docstring strtok:
197 # Usage: strtok s1 s2
198 #
199 # Strtok considers the string s1 to consist of a sequence of zero or more
200 # text tokens separated by spans of one or more characters from the
201 # separator string s2\.  The first call (with a non-empty string s1
202 # specified) echoes a string consisting of the first token on stdout. The
203 # function keeps track of its position in the string s1 between separate
204 # calls, so that subsequent calls made with the first argument an empty
205 # string will work through the string immediately following that token.  In
206 # this way subsequent calls will work through the string s1 until no tokens
207 # remain.  The separator string s2 may be different from call to call.
208 # When no token remains in s1, an empty value is echoed on stdout.
209 #:end docstring:
210 
211 ###;;;autoload
212 function strtok ()
213 {
214  :
215 }
216 
217 #:docstring strtrunc:
218 # Usage: strtrunc $n $s1 {$s2} {$...}
219 #
220 # Used by many functions like strncmp to truncate arguments for comparison.
221 # Echoes the first n characters of each string s1 s2 ... on stdout. 
222 #:end docstring:
223 
224 ###;;;autoload
225 function strtrunc ()
226 {
227     n=$1 ; shift
228     for z; do
229         echo "${z:0:$n}"
230     done
231 }
232 
233 # provide string
234 
235 # string.bash ends here
236 
237 
238 # ========================================================================== #
239 # ==> Everything below here added by the document author.
240 
241 # ==> Suggested use of this script is to delete everything below here,
242 # ==> and "source" this file into your own scripts.
243 
244 # strcat
245 string0=one
246 string1=two
247 echo
248 echo "Testing \"strcat\" function:"
249 echo "Original \"string0\" = $string0"
250 echo "\"string1\" = $string1"
251 strcat string0 string1
252 echo "New \"string0\" = $string0"
253 echo
254 
255 # strlen
256 echo
257 echo "Testing \"strlen\" function:"
258 str=123456789
259 echo "\"str\" = $str"
260 echo -n "Length of \"str\" = "
261 strlen str
262 echo
263 
264 
265 
266 # Exercise:
267 # --------
268 # Add code to test all the other string functions above.
269 
270 
271 exit 0</pre>

 |

* * *

这个复杂的数组用例使用了[md5sum](filearchiv.md#MD5SUMREF)检查和命令来编码目录信息, 此脚本由Michael Zick编写.

* * *

**例子 A-19\. 目录信息**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # directory-info.sh
  3 # Parses and lists directory information.
  4 
  5 # NOTE: Change lines 273 and 353 per "README" file.
  6 
  7 # Michael Zick is the author of this script.
  8 # Used here with his permission.
  9 
 10 # Controls
 11 # If overridden by command arguments, they must be in the order:
 12 #   Arg1: "Descriptor Directory"
 13 #   Arg2: "Exclude Paths"
 14 #   Arg3: "Exclude Directories"
 15 #
 16 # Environment Settings override Defaults.
 17 # Command arguments override Environment Settings.
 18 
 19 # Default location for content addressed file descriptors.
 20 MD5UCFS=${1:-${MD5UCFS:-'/tmpfs/ucfs'}}
 21 
 22 # Directory paths never to list or enter
 23 declare -a \
 24   EXCLUDE_PATHS=${2:-${EXCLUDE_PATHS:-'(/proc /dev /devfs /tmpfs)'}}
 25 
 26 # Directories never to list or enter
 27 declare -a \
 28   EXCLUDE_DIRS=${3:-${EXCLUDE_DIRS:-'(ucfs lost+found tmp wtmp)'}}
 29 
 30 # Files never to list or enter
 31 declare -a \
 32   EXCLUDE_FILES=${3:-${EXCLUDE_FILES:-'(core "Name with Spaces")'}}
 33 
 34 
 35 # Here document used as a comment block.
 36 : <<LSfieldsDoc
 37 # # # # # List Filesystem Directory Information # # # # #
 38 #
 39 #	ListDirectory "FileGlob" "Field-Array-Name"
 40 # or
 41 #	ListDirectory -of "FileGlob" "Field-Array-Filename"
 42 #	'-of' meaning 'output to filename'
 43 # # # # #
 44 
 45 String format description based on: ls (GNU fileutils) version 4.0.36
 46 
 47 Produces a line (or more) formatted:
 48 inode permissions hard-links owner group ...
 49 32736 -rw-------    1 mszick   mszick
 50 
 51 size    day month date hh:mm:ss year path
 52 2756608 Sun Apr 20 08:53:06 2003 /home/mszick/core
 53 
 54 Unless it is formatted:
 55 inode permissions hard-links owner group ...
 56 266705 crw-rw----    1    root  uucp
 57 
 58 major minor day month date hh:mm:ss year path
 59 4,  68 Sun Apr 20 09:27:33 2003 /dev/ttyS4
 60 NOTE: that pesky comma after the major number
 61 
 62 NOTE: the 'path' may be multiple fields:
 63 /home/mszick/core
 64 /proc/982/fd/0 -> /dev/null
 65 /proc/982/fd/1 -> /home/mszick/.xsession-errors
 66 /proc/982/fd/13 -> /tmp/tmpfZVVOCs (deleted)
 67 /proc/982/fd/7 -> /tmp/kde-mszick/ksycoca
 68 /proc/982/fd/8 -> socket:[11586]
 69 /proc/982/fd/9 -> pipe:[11588]
 70 
 71 If that isn't enough to keep your parser guessing,
 72 either or both of the path components may be relative:
 73 ../Built-Shared -> Built-Static
 74 ../linux-2.4.20.tar.bz2 -> ../../../SRCS/linux-2.4.20.tar.bz2
 75 
 76 The first character of the 11 (10?) character permissions field:
 77 's' Socket
 78 'd' Directory
 79 'b' Block device
 80 'c' Character device
 81 'l' Symbolic link
 82 NOTE: Hard links not marked - test for identical inode numbers
 83 on identical filesystems.
 84 All information about hard linked files are shared, except
 85 for the names and the name's location in the directory system.
 86 NOTE: A "Hard link" is known as a "File Alias" on some systems.
 87 '-' An undistingushed file
 88 
 89 Followed by three groups of letters for: User, Group, Others
 90 Character 1: '-' Not readable; 'r' Readable
 91 Character 2: '-' Not writable; 'w' Writable
 92 Character 3, User and Group: Combined execute and special
 93 '-' Not Executable, Not Special
 94 'x' Executable, Not Special
 95 's' Executable, Special
 96 'S' Not Executable, Special
 97 Character 3, Others: Combined execute and sticky (tacky?)
 98 '-' Not Executable, Not Tacky
 99 'x' Executable, Not Tacky
100 't' Executable, Tacky
101 'T' Not Executable, Tacky
102 
103 Followed by an access indicator
104 Haven't tested this one, it may be the eleventh character
105 or it may generate another field
106 ' ' No alternate access
107 '+' Alternate access
108 LSfieldsDoc
109 
110 
111 ListDirectory()
112 {
113 	local -a T
114 	local -i of=0		# Default return in variable
115 #	OLD_IFS=$IFS		# Using BASH default ' \t\n'
116 
117 	case "$#" in
118 	3)	case "$1" in
119 		-of)	of=1 ; shift ;;
120 		 * )	return 1 ;;
121 		esac ;;
122 	2)	: ;;		# Poor man's "continue"
123 	*)	return 1 ;;
124 	esac
125 
126 	# NOTE: the (ls) command is NOT quoted (")
127 	T=( $(ls --inode --ignore-backups --almost-all --directory \
128 	--full-time --color=none --time=status --sort=none \
129 	--format=long $1) )
130 
131 	case $of in
132 	# Assign T back to the array whose name was passed as $2
133 		0) eval $2=\( \"\$\{T\[@\]\}\" \) ;;
134 	# Write T into filename passed as $2
135 		1) echo "${T[@]}" > "$2" ;;
136 	esac
137 	return 0
138    }
139 
140 # # # # # Is that string a legal number? # # # # #
141 #
142 #	IsNumber "Var"
143 # # # # # There has to be a better way, sigh...
144 
145 IsNumber()
146 {
147 	local -i int
148 	if [ $# -eq 0 ]
149 	then
150 		return 1
151 	else
152 		(let int=$1)  2>/dev/null
153 		return $?	# Exit status of the let thread
154 	fi
155 }
156 
157 # # # # # Index Filesystem Directory Information # # # # #
158 #
159 #	IndexList "Field-Array-Name" "Index-Array-Name"
160 # or
161 #	IndexList -if Field-Array-Filename Index-Array-Name
162 #	IndexList -of Field-Array-Name Index-Array-Filename
163 #	IndexList -if -of Field-Array-Filename Index-Array-Filename
164 # # # # #
165 
166 : <<IndexListDoc
167 Walk an array of directory fields produced by ListDirectory
168 
169 Having suppressed the line breaks in an otherwise line oriented
170 report, build an index to the array element which starts each line.
171 
172 Each line gets two index entries, the first element of each line
173 (inode) and the element that holds the pathname of the file.
174 
175 The first index entry pair (Line-Number==0) are informational:
176 Index-Array-Name[0] : Number of "Lines" indexed
177 Index-Array-Name[1] : "Current Line" pointer into Index-Array-Name
178 
179 The following index pairs (if any) hold element indexes into
180 the Field-Array-Name per:
181 Index-Array-Name[Line-Number * 2] : The "inode" field element.
182 NOTE: This distance may be either +11 or +12 elements.
183 Index-Array-Name[(Line-Number * 2) + 1] : The "pathname" element.
184 NOTE: This distance may be a variable number of elements.
185 Next line index pair for Line-Number+1.
186 IndexListDoc
187 
188 
189 
190 IndexList()
191 {
192 	local -a LIST			# Local of listname passed
193 	local -a -i INDEX=( 0 0 )	# Local of index to return
194 	local -i Lidx Lcnt
195 	local -i if=0 of=0		# Default to variable names
196 
197 	case "$#" in			# Simplistic option testing
198 		0) return 1 ;;
199 		1) return 1 ;;
200 		2) : ;;			# Poor man's continue
201 		3) case "$1" in
202 			-if) if=1 ;;
203 			-of) of=1 ;;
204 			 * ) return 1 ;;
205 		   esac ; shift ;;
206 		4) if=1 ; of=1 ; shift ; shift ;;
207 		*) return 1
208 	esac
209 
210 	# Make local copy of list
211 	case "$if" in
212 		0) eval LIST=\( \"\$\{$1\[@\]\}\" \) ;;
213 		1) LIST=( $(cat $1) ) ;;
214 	esac
215 
216 	# Grok (grope?) the array
217 	Lcnt=${#LIST[@]}
218 	Lidx=0
219 	until (( Lidx >= Lcnt ))
220 	do
221 	if IsNumber ${LIST[$Lidx]}
222 	then
223 		local -i inode name
224 		local ft
225 		inode=Lidx
226 		local m=${LIST[$Lidx+2]}	# Hard Links field
227 		ft=${LIST[$Lidx+1]:0:1} 	# Fast-Stat
228 		case $ft in
229 		b)	((Lidx+=12)) ;;		# Block device
230 		c)	((Lidx+=12)) ;;		# Character device
231 		*)	((Lidx+=11)) ;;		# Anything else
232 		esac
233 		name=Lidx
234 		case $ft in
235 		-)	((Lidx+=1)) ;;		# The easy one
236 		b)	((Lidx+=1)) ;;		# Block device
237 		c)	((Lidx+=1)) ;;		# Character device
238 		d)	((Lidx+=1)) ;;		# The other easy one
239 		l)	((Lidx+=3)) ;;		# At LEAST two more fields
240 #  A little more elegance here would handle pipes,
241 #+ sockets, deleted files - later.
242 		*)	until IsNumber ${LIST[$Lidx]} || ((Lidx >= Lcnt))
243 			do
244 				((Lidx+=1))
245 			done
246 			;;			# Not required
247 		esac
248 		INDEX[${#INDEX[*]}]=$inode
249 		INDEX[${#INDEX[*]}]=$name
250 		INDEX[0]=${INDEX[0]}+1		# One more "line" found
251 # echo "Line: ${INDEX[0]} Type: $ft Links: $m Inode: \
252 # ${LIST[$inode]} Name: ${LIST[$name]}"
253 
254 	else
255 		((Lidx+=1))
256 	fi
257 	done
258 	case "$of" in
259 		0) eval $2=\( \"\$\{INDEX\[@\]\}\" \) ;;
260 		1) echo "${INDEX[@]}" > "$2" ;;
261 	esac
262 	return 0				# What could go wrong?
263 }
264 
265 # # # # # Content Identify File # # # # #
266 #
267 #	DigestFile Input-Array-Name Digest-Array-Name
268 # or
269 #	DigestFile -if Input-FileName Digest-Array-Name
270 # # # # #
271 
272 # Here document used as a comment block.
273 : <<DigestFilesDoc
274 
275 The key (no pun intended) to a Unified Content File System (UCFS)
276 is to distinguish the files in the system based on their content.
277 Distinguishing files by their name is just, so, 20th Century.
278 
279 The content is distinguished by computing a checksum of that content.
280 This version uses the md5sum program to generate a 128 bit checksum
281 representative of the file's contents.
282 There is a chance that two files having different content might
283 generate the same checksum using md5sum (or any checksum).  Should
284 that become a problem, then the use of md5sum can be replace by a
285 cyrptographic signature.  But until then...
286 
287 The md5sum program is documented as outputting three fields (and it
288 does), but when read it appears as two fields (array elements).  This
289 is caused by the lack of whitespace between the second and third field.
290 So this function gropes the md5sum output and returns:
291 	[0]	32 character checksum in hexidecimal (UCFS filename)
292 	[1]	Single character: ' ' text file, '*' binary file
293 	[2]	Filesystem (20th Century Style) name
294 	Note: That name may be the character '-' indicating STDIN read.
295 
296 DigestFilesDoc
297 
298 
299 
300 DigestFile()
301 {
302 	local if=0		# Default, variable name
303 	local -a T1 T2
304 
305 	case "$#" in
306 	3)	case "$1" in
307 		-if)	if=1 ; shift ;;
308 		 * )	return 1 ;;
309 		esac ;;
310 	2)	: ;;		# Poor man's "continue"
311 	*)	return 1 ;;
312 	esac
313 
314 	case $if in
315 	0) eval T1=\( \"\$\{$1\[@\]\}\" \)
316 	   T2=( $(echo ${T1[@]} | md5sum -) )
317 	   ;;
318 	1) T2=( $(md5sum $1) )
319 	   ;;
320 	esac
321 
322 	case ${#T2[@]} in
323 	0) return 1 ;;
324 	1) return 1 ;;
325 	2) case ${T2[1]:0:1} in		# SanScrit-2.0.5
326 	   \*) T2[${#T2[@]}]=${T2[1]:1}
327 	       T2[1]=\*
328 	       ;;
329 	    *) T2[${#T2[@]}]=${T2[1]}
330 	       T2[1]=" "
331 	       ;;
332 	   esac
333 	   ;;
334 	3) : ;; # Assume it worked
335 	*) return 1 ;;
336 	esac
337 
338 	local -i len=${#T2[0]}
339 	if [ $len -ne 32 ] ; then return 1 ; fi
340 	eval $2=\( \"\$\{T2\[@\]\}\" \)
341 }
342 
343 # # # # # Locate File # # # # #
344 #
345 #	LocateFile [-l] FileName Location-Array-Name
346 # or
347 #	LocateFile [-l] -of FileName Location-Array-FileName
348 # # # # #
349 
350 # A file location is Filesystem-id and inode-number
351 
352 # Here document used as a comment block.
353 : <<StatFieldsDoc
354 	Based on stat, version 2.2
355 	stat -t and stat -lt fields
356 	[0]	name
357 	[1]	Total size
358 		File - number of bytes
359 		Symbolic link - string length of pathname
360 	[2]	Number of (512 byte) blocks allocated
361 	[3]	File type and Access rights (hex)
362 	[4]	User ID of owner
363 	[5]	Group ID of owner
364 	[6]	Device number
365 	[7]	Inode number
366 	[8]	Number of hard links
367 	[9]	Device type (if inode device) Major
368 	[10]	Device type (if inode device) Minor
369 	[11]	Time of last access
370 		May be disabled in 'mount' with noatime
371 		atime of files changed by exec, read, pipe, utime, mknod (mmap?)
372 		atime of directories changed by addition/deletion of files
373 	[12]	Time of last modification
374 		mtime of files changed by write, truncate, utime, mknod
375 		mtime of directories changed by addtition/deletion of files
376 	[13]	Time of last change
377 		ctime reflects time of changed inode information (owner, group
378 		permissions, link count
379 -*-*- Per:
380 	Return code: 0
381 	Size of array: 14
382 	Contents of array
383 	Element 0: /home/mszick
384 	Element 1: 4096
385 	Element 2: 8
386 	Element 3: 41e8
387 	Element 4: 500
388 	Element 5: 500
389 	Element 6: 303
390 	Element 7: 32385
391 	Element 8: 22
392 	Element 9: 0
393 	Element 10: 0
394 	Element 11: 1051221030
395 	Element 12: 1051214068
396 	Element 13: 1051214068
397 
398 	For a link in the form of linkname -> realname
399 	stat -t  linkname returns the linkname (link) information
400 	stat -lt linkname returns the realname information
401 
402 	stat -tf and stat -ltf fields
403 	[0]	name
404 	[1]	ID-0?		# Maybe someday, but Linux stat structure
405 	[2]	ID-0?		# does not have either LABEL nor UUID
406 				# fields, currently information must come
407 				# from file-system specific utilities
408 	These will be munged into:
409 	[1]	UUID if possible
410 	[2]	Volume Label if possible
411 	Note: 'mount -l' does return the label and could return the UUID
412 
413 	[3]	Maximum length of filenames
414 	[4]	Filesystem type
415 	[5]	Total blocks in the filesystem
416 	[6]	Free blocks
417 	[7]	Free blocks for non-root user(s)
418 	[8]	Block size of the filesystem
419 	[9]	Total inodes
420 	[10]	Free inodes
421 
422 -*-*- Per:
423 	Return code: 0
424 	Size of array: 11
425 	Contents of array
426 	Element 0: /home/mszick
427 	Element 1: 0
428 	Element 2: 0
429 	Element 3: 255
430 	Element 4: ef53
431 	Element 5: 2581445
432 	Element 6: 2277180
433 	Element 7: 2146050
434 	Element 8: 4096
435 	Element 9: 1311552
436 	Element 10: 1276425
437 
438 StatFieldsDoc
439 
440 
441 #	LocateFile [-l] FileName Location-Array-Name
442 #	LocateFile [-l] -of FileName Location-Array-FileName
443 
444 LocateFile()
445 {
446 	local -a LOC LOC1 LOC2
447 	local lk="" of=0
448 
449 	case "$#" in
450 	0) return 1 ;;
451 	1) return 1 ;;
452 	2) : ;;
453 	*) while (( "$#" > 2 ))
454 	   do
455 	      case "$1" in
456 	       -l) lk=-1 ;;
457 	      -of) of=1 ;;
458 	        *) return 1 ;;
459 	      esac
460 	   shift
461            done ;;
462 	esac
463 
464 # More Sanscrit-2.0.5
465       # LOC1=( $(stat -t $lk $1) )
466       # LOC2=( $(stat -tf $lk $1) )
467       # Uncomment above two lines if system has "stat" command installed.
468 	LOC=( ${LOC1[@]:0:1} ${LOC1[@]:3:11}
469 	      ${LOC2[@]:1:2} ${LOC2[@]:4:1} )
470 
471 	case "$of" in
472 		0) eval $2=\( \"\$\{LOC\[@\]\}\" \) ;;
473 		1) echo "${LOC[@]}" > "$2" ;;
474 	esac
475 	return 0
476 # Which yields (if you are lucky, and have "stat" installed)
477 # -*-*- Location Discriptor -*-*-
478 #	Return code: 0
479 #	Size of array: 15
480 #	Contents of array
481 #	Element 0: /home/mszick		20th Century name
482 #	Element 1: 41e8			Type and Permissions
483 #	Element 2: 500			User
484 #	Element 3: 500			Group
485 #	Element 4: 303			Device
486 #	Element 5: 32385		inode
487 #	Element 6: 22			Link count
488 #	Element 7: 0			Device Major
489 #	Element 8: 0			Device Minor
490 #	Element 9: 1051224608		Last Access
491 #	Element 10: 1051214068		Last Modify
492 #	Element 11: 1051214068		Last Status
493 #	Element 12: 0			UUID (to be)
494 #	Element 13: 0			Volume Label (to be)
495 #	Element 14: ef53		Filesystem type
496 }
497 
498 
499 
500 # And then there was some test code
501 
502 ListArray() # ListArray Name
503 {
504 	local -a Ta
505 
506 	eval Ta=\( \"\$\{$1\[@\]\}\" \)
507 	echo
508 	echo "-*-*- List of Array -*-*-"
509 	echo "Size of array $1: ${#Ta[*]}"
510 	echo "Contents of array $1:"
511 	for (( i=0 ; i<${#Ta[*]} ; i++ ))
512 	do
513 	    echo -e "\tElement $i: ${Ta[$i]}"
514 	done
515 	return 0
516 }
517 
518 declare -a CUR_DIR
519 # For small arrays
520 ListDirectory "${PWD}" CUR_DIR
521 ListArray CUR_DIR
522 
523 declare -a DIR_DIG
524 DigestFile CUR_DIR DIR_DIG
525 echo "The new \"name\" (checksum) for ${CUR_DIR[9]} is ${DIR_DIG[0]}"
526 
527 declare -a DIR_ENT
528 # BIG_DIR # For really big arrays - use a temporary file in ramdisk
529 # BIG-DIR # ListDirectory -of "${CUR_DIR[11]}/*" "/tmpfs/junk2"
530 ListDirectory "${CUR_DIR[11]}/*" DIR_ENT
531 
532 declare -a DIR_IDX
533 # BIG-DIR # IndexList -if "/tmpfs/junk2" DIR_IDX
534 IndexList DIR_ENT DIR_IDX
535 
536 declare -a IDX_DIG
537 # BIG-DIR # DIR_ENT=( $(cat /tmpfs/junk2) )
538 # BIG-DIR # DigestFile -if /tmpfs/junk2 IDX_DIG
539 DigestFile DIR_ENT IDX_DIG
540 # Small (should) be able to parallize IndexList & DigestFile
541 # Large (should) be able to parallize IndexList & DigestFile & the assignment
542 echo "The \"name\" (checksum) for the contents of ${PWD} is ${IDX_DIG[0]}"
543 
544 declare -a FILE_LOC
545 LocateFile ${PWD} FILE_LOC
546 ListArray FILE_LOC
547 
548 exit 0</pre>

 |

* * *

Stephane Chazelas向我们展示了如何在Bash脚本中使用面向对象的编程方法.

* * *

**例子 A-20\. 面向对象数据库**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # obj-oriented.sh: Object-oriented programming in a shell script.
  3 # Script by Stephane Chazelas.
  4 
  5 #  Important Note:
  6 #  --------- ----
  7 #  If running this script under version 3 or later of Bash,
  8 #+ replace all periods in function names with a "legal" character,
  9 #+ for example, an underscore.
 10 
 11 
 12 person.new()        # Looks almost like a class declaration in C++.
 13 {
 14   local obj_name=$1 name=$2 firstname=$3 birthdate=$4
 15 
 16   eval "$obj_name.set_name() {
 17           eval \"$obj_name.get_name() {
 18                    echo \$1
 19                  }\"
 20         }"
 21 
 22   eval "$obj_name.set_firstname() {
 23           eval \"$obj_name.get_firstname() {
 24                    echo \$1
 25                  }\"
 26         }"
 27 
 28   eval "$obj_name.set_birthdate() {
 29           eval \"$obj_name.get_birthdate() {
 30             echo \$1
 31           }\"
 32           eval \"$obj_name.show_birthdate() {
 33             echo \$(date -d \"1/1/1970 0:0:\$1 GMT\")
 34           }\"
 35           eval \"$obj_name.get_age() {
 36             echo \$(( (\$(date +%s) - \$1) / 3600 / 24 / 365 ))
 37           }\"
 38         }"
 39 
 40   $obj_name.set_name $name
 41   $obj_name.set_firstname $firstname
 42   $obj_name.set_birthdate $birthdate
 43 }
 44 
 45 echo
 46 
 47 person.new self Bozeman Bozo 101272413
 48 # Create an instance of "person.new" (actually passing args to the function).
 49 
 50 self.get_firstname       #   Bozo
 51 self.get_name            #   Bozeman
 52 self.get_age             #   28
 53 self.get_birthdate       #   101272413
 54 self.show_birthdate      #   Sat Mar 17 20:13:33 MST 1973
 55 
 56 echo
 57 
 58 #  typeset -f
 59 #+ to see the created functions (careful, it scrolls off the page).
 60 
 61 exit 0</pre>

 |

* * *

Mariusz Gniazdowski发布了一个可以在脚本中使用的[hash](internal.md#HASHREF)库.

* * *

**例子 A-21\. hash函数库**

| 

<pre class="PROGRAMLISTING">  1 # Hash:
  2 # Hash function library
  3 # Author: Mariusz Gniazdowski <mgniazd-at-gmail.com>
  4 # Date: 2005-04-07
  5 
  6 # Functions making emulating hashes in Bash a little less painful.
  7 
  8 
  9 #    Limitations:
 10 #  * Only global variables are supported.
 11 #  * Each hash instance generates one global variable per value.
 12 #  * Variable names collisions are possible
 13 #+   if you define variable like __hash__hashname_key
 14 #  * Keys must use chars that can be part of a Bash variable name
 15 #+   (no dashes, periods, etc.).
 16 #  * The hash is created as a variable:
 17 #    ... hashname_keyname
 18 #    So if somone will create hashes like:
 19 #      myhash_ + mykey = myhash__mykey
 20 #      myhash + _mykey = myhash__mykey
 21 #    Then there will be a collision.
 22 #    (This should not pose a major problem.)
 23 
 24 
 25 Hash_config_varname_prefix=__hash__
 26 
 27 
 28 # Emulates:  hash[key]=value
 29 #
 30 # Params:
 31 # 1 - hash
 32 # 2 - key
 33 # 3 - value
 34 function hash_set {
 35 	eval "${Hash_config_varname_prefix}${1}_${2}=\"${3}\""
 36 }
 37 
 38 
 39 # Emulates:  value=hash[key]
 40 #
 41 # Params:
 42 # 1 - hash
 43 # 2 - key
 44 # 3 - value (name of global variable to set)
 45 function hash_get_into {
 46 	eval "$3=\"\${Hash_config_varname_prefix}${1}_${2}\""
 47 }
 48 
 49 
 50 # Emulates:  echo hash[key]
 51 #
 52 # Params:
 53 # 1 - hash
 54 # 2 - key
 55 # 3 - echo params (like -n, for example)
 56 function hash_echo {
 57 	eval "echo $3 \"\${Hash_config_varname_prefix}${1}_${2}\""
 58 }
 59 
 60 
 61 # Emulates:  hash1[key1]=hash2[key2]
 62 #
 63 # Params:
 64 # 1 - hash1
 65 # 2 - key1
 66 # 3 - hash2
 67 # 4 - key2
 68 function hash_copy {
 69 	eval "${Hash_config_varname_prefix}${1}_${2}=\"\${Hash_config_varname_prefix}${3}_${4}\""
 70 }
 71 
 72 
 73 # Emulates:  hash[keyN-1]=hash[key2]=...hash[key1]
 74 #
 75 # Copies first key to rest of keys.
 76 #
 77 # Params:
 78 # 1 - hash1
 79 # 2 - key1
 80 # 3 - key2
 81 # . . .
 82 # N - keyN
 83 function hash_dup {
 84 	local hashName="$1" keyName="$2"
 85 	shift 2
 86 	until [ ${#} -le 0 ]; do
 87 		eval "${Hash_config_varname_prefix}${hashName}_${1}=\"\${Hash_config_varname_prefix}${hashName}_${keyName}\""
 88 		shift;
 89 	done;
 90 }
 91 
 92 
 93 # Emulates:  unset hash[key]
 94 #
 95 # Params:
 96 # 1 - hash
 97 # 2 - key
 98 function hash_unset {
 99 	eval "unset ${Hash_config_varname_prefix}${1}_${2}"
100 }
101 
102 
103 # Emulates something similar to:  ref=&hash[key]
104 #
105 # The reference is name of the variable in which value is held.
106 #
107 # Params:
108 # 1 - hash
109 # 2 - key
110 # 3 - ref - Name of global variable to set.
111 function hash_get_ref_into {
112 	eval "$3=\"${Hash_config_varname_prefix}${1}_${2}\""
113 }
114 
115 
116 # Emulates something similar to:  echo &hash[key]
117 #
118 # That reference is name of variable in which value is held.
119 #
120 # Params:
121 # 1 - hash
122 # 2 - key
123 # 3 - echo params (like -n for example)
124 function hash_echo_ref {
125 	eval "echo $3 \"${Hash_config_varname_prefix}${1}_${2}\""
126 }
127 
128 
129 
130 # Emulates something similar to:  $hash[key](param1, param2, ...)
131 #
132 # Params:
133 # 1 - hash
134 # 2 - key
135 # 3,4, ... - Function parameters
136 function hash_call {
137 	local hash key
138 	hash=$1
139 	key=$2
140 	shift 2
141 	eval "eval \"\${Hash_config_varname_prefix}${hash}_${key} \\\"\\\$@\\\"\""
142 }
143 
144 
145 # Emulates something similar to:  isset(hash[key]) or hash[key]==NULL
146 #
147 # Params:
148 # 1 - hash
149 # 2 - key
150 # Returns:
151 # 0 - there is such key
152 # 1 - there is no such key
153 function hash_is_set {
154 	eval "if [[ \"\${${Hash_config_varname_prefix}${1}_${2}-a}\" = \"a\" && 
155 			\"\${${Hash_config_varname_prefix}${1}_${2}-b}\" = \"b\" ]]; then return 1; else return 0; fi"
156 }
157 
158 
159 # Emulates something similar to:
160 #   foreach($hash as $key => $value) { fun($key,$value); }
161 #
162 # It is possible to write different variations of this function.
163 # Here we use a function call to make it as "generic" as possible.
164 #
165 # Params:
166 # 1 - hash
167 # 2 - function name
168 function hash_foreach {
169 	local keyname oldIFS="$IFS"
170 	IFS=' '
171 	for i in $(eval "echo \${!${Hash_config_varname_prefix}${1}_*}"); do
172 		keyname=$(eval "echo \${i##${Hash_config_varname_prefix}${1}_}")
173 		eval "$2 $keyname \"\$i\""
174 	done
175 	IFS="$oldIFS"
176 }
177 
178 # NOTE: In lines 103 and 116, ampersand changed.
179 #       But, it doesn't matter, because these are comment lines anyhow.</pre>

 |

* * *

这是个例子脚本, 这个脚本使用了前面的hash库.

* * *

**例子 A-22\. 使用hash函数来给文本上色**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # hash-example.sh: Colorizing text.
  3 # Author: Mariusz Gniazdowski <mgniazd-at-gmail.com>
  4 
  5 . Hash.lib      # Load the library of functions.
  6 
  7 hash_set colors red          "\033[0;31m"
  8 hash_set colors blue         "\033[0;34m"
  9 hash_set colors light_blue   "\033[1;34m"
 10 hash_set colors light_red    "\033[1;31m"
 11 hash_set colors cyan         "\033[0;36m"
 12 hash_set colors light_green  "\033[1;32m"
 13 hash_set colors light_gray   "\033[0;37m"
 14 hash_set colors green        "\033[0;32m"
 15 hash_set colors yellow       "\033[1;33m"
 16 hash_set colors light_purple "\033[1;35m"
 17 hash_set colors purple       "\033[0;35m"
 18 hash_set colors reset_color  "\033[0;00m"
 19 
 20 
 21 # $1 - keyname
 22 # $2 - value
 23 try_colors() {
 24 	echo -en "$2"
 25 	echo "This line is $1."
 26 }
 27 hash_foreach colors try_colors
 28 hash_echo colors reset_color -en
 29 
 30 echo -e '\nLet us overwrite some colors with yellow.\n'
 31 # It's hard to read yellow text on some terminals.
 32 hash_dup colors yellow   red light_green blue green light_gray cyan
 33 hash_foreach colors try_colors
 34 hash_echo colors reset_color -en
 35 
 36 echo -e '\nLet us delete them and try colors once more . . .\n'
 37 
 38 for i in red light_green blue green light_gray cyan; do
 39 	hash_unset colors $i
 40 done
 41 hash_foreach colors try_colors
 42 hash_echo colors reset_color -en
 43 
 44 hash_set other txt "Other examples . . ."
 45 hash_echo other txt
 46 hash_get_into other txt text
 47 echo $text
 48 
 49 hash_set other my_fun try_colors
 50 hash_call other my_fun   purple "`hash_echo colors purple`"
 51 hash_echo colors reset_color -en
 52 
 53 echo; echo "Back to normal?"; echo
 54 
 55 exit $?
 56 
 57 #  On some terminals, the "light" colors print in bold,
 58 #  and end up looking darker than the normal ones.
 59 #  Why is this?</pre>

 |

* * *

站在一个比较难的观点来阐明hash的结构.

* * *

**例子 A-23\. 深入hash函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # $Id: ha.sh,v 1.2 2005/04/21 23:24:26 oliver Exp $
  3 # Copyright 2005 Oliver Beckstein
  4 # Released under the GNU Public License
  5 # Author of script granted permission for inclusion in ABS Guide.
  6 # (Thank you!)
  7 
  8 #----------------------------------------------------------------
  9 # pseudo hash based on indirect parameter expansion
 10 # API: access through functions:
 11 # 
 12 # create the hash:
 13 #  
 14 #      newhash Lovers
 15 #
 16 # add entries (note single quotes for spaces)
 17 #    
 18 #      addhash Lovers Tristan Isolde
 19 #      addhash Lovers 'Romeo Montague' 'Juliet Capulet'
 20 #
 21 # access value by key
 22 #
 23 #      gethash Lovers Tristan   ---->  Isolde
 24 #
 25 # show all keys
 26 #
 27 #      keyshash Lovers         ----> 'Tristan'  'Romeo Montague'
 28 #
 29 #
 30 # convention: instead of perls' foo{bar} = boing' syntax,
 31 # use
 32 #       '_foo_bar=boing' (two underscores, no spaces)
 33 #
 34 # 1) store key   in _NAME_keys[]
 35 # 2) store value in _NAME_values[] using the same integer index
 36 # The integer index for the last entry is _NAME_ptr
 37 #
 38 # NOTE: No error or sanity checks, just bare bones.
 39 
 40 
 41 function _inihash () {
 42     # private function
 43     # call at the beginning of each procedure
 44     # defines: _keys _values _ptr
 45     #
 46     # usage: _inihash NAME
 47     local name=$1
 48     _keys=_${name}_keys
 49     _values=_${name}_values
 50     _ptr=_${name}_ptr
 51 }
 52 
 53 function newhash () {
 54     # usage: newhash NAME
 55     #        NAME should not contain spaces or '.';
 56     #        actually: it must be a legal name for a bash variable
 57     # We rely on bash automatically recognising arrays.
 58     local name=$1 
 59     local _keys _values _ptr
 60     _inihash ${name}
 61     eval ${_ptr}=0
 62 }
 63 
 64 
 65 function addhash () {
 66     # usage: addhash NAME KEY 'VALUE with spaces'
 67     #        arguments with spaces need to be quoted with single quotes ''
 68     local name=$1 k="$2" v="$3" 
 69     local _keys _values _ptr
 70     _inihash ${name}
 71 
 72     #echo "DEBUG(addhash): ${_ptr}=${!_ptr}"
 73 
 74     eval let ${_ptr}=${_ptr}+1
 75     eval "$_keys[${!_ptr}]=\"${k}\""
 76     eval "$_values[${!_ptr}]=\"${v}\""
 77 }
 78 
 79 function gethash () {
 80     # usage: gethash NAME KEY
 81     #        returns boing
 82     #        ERR=0 if entry found, 1 otherwise
 83     # Thats not a proper hash---we simply linearly search through the keys
 84     local name=$1 key="$2" 
 85     local _keys _values _ptr 
 86     local k v i found h
 87     _inihash ${name}
 88     
 89     # _ptr holds the highest index in the hash
 90     found=0
 91 
 92     for i in $(seq 1 ${!_ptr}); do
 93 	h="\${${_keys}[${i}]}"  # safer to do it in two steps
 94 	eval k=${h}             # (especially when quoting for spaces)
 95 	if [ "${k}" = "${key}" ]; then found=1; break; fi
 96     done;
 97 
 98     [ ${found} = 0 ] && return 1;
 99     # else: i is the index that matches the key
100     h="\${${_values}[${i}]}"
101     eval echo "${h}"
102     return 0;	
103 }
104 
105 function keyshash () {
106     # usage: keyshash NAME
107     # returns list of all keys defined for hash name
108     local name=$1 key="$2" 
109     local _keys _values _ptr 
110     local k i h
111     _inihash ${name}
112     
113     # _ptr holds the highest index in the hash
114     for i in $(seq 1 ${!_ptr}); do
115 	h="\${${_keys}[${i}]}"   # Safer to do it in two steps
116 	eval k=${h}              # (especially when quoting for spaces)
117 	echo -n "'${k}' "
118     done;
119 }
120 
121 
122 # --------------------------------------------------------------------
123 
124 # Now, let's test it.
125 # (Per comments at the beginning of the script.)
126 newhash Lovers
127 addhash Lovers Tristan Isolde
128 addhash Lovers 'Romeo Montague' 'Juliet Capulet'
129 
130 # Output results.
131 echo
132 gethash Lovers Tristan      # Isolde
133 echo
134 keyshash Lovers             # 'Tristan' 'Romeo Montague'
135 echo; echo
136 
137 
138 exit 0
139 
140 # Exercise: Add error checks to the functions.</pre>

 |

* * *

下面这个脚本可以用来安装和挂载那些小的USB keychain<span class="QUOTE">"硬件设备"</span>(译者: 就是U盘一类的东西).

* * *

**例子 A-24\. 挂载USB keychain型的存储设备**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ==> usb.sh
  3 # ==> Script for mounting and installing pen/keychain USB storage devices.
  4 # ==> Runs as root at system startup (see below).
  5 # ==>
  6 # ==> Newer Linux distros (2004 or later) autodetect
  7 # ==> and install USB pen drives, and therefore don't need this script.
  8 # ==> But, it's still instructive.
  9  
 10 #  This code is free software covered by GNU GPL license version 2 or above.
 11 #  Please refer to http://www.gnu.org/ for the full license text.
 12 #
 13 #  Some code lifted from usb-mount by Michael Hamilton's usb-mount (LGPL)
 14 #+ see http://users.actrix.co.nz/michael/usbmount.html
 15 #
 16 #  INSTALL
 17 #  -------
 18 #  Put this in /etc/hotplug/usb/diskonkey.
 19 #  Then look in /etc/hotplug/usb.distmap, and copy all usb-storage entries
 20 #+ into /etc/hotplug/usb.usermap, substituting "usb-storage" for "diskonkey".
 21 #  Otherwise this code is only run during the kernel module invocation/removal
 22 #+ (at least in my tests), which defeats the purpose.
 23 #
 24 #  TODO
 25 #  ----
 26 #  Handle more than one diskonkey device at one time (e.g. /dev/diskonkey1
 27 #+ and /mnt/diskonkey1), etc. The biggest problem here is the handling in
 28 #+ devlabel, which I haven't yet tried.
 29 #
 30 #  AUTHOR and SUPPORT
 31 #  ------------------
 32 #  Konstantin Riabitsev, <icon linux duke edu>.
 33 #  Send any problem reports to my email address at the moment.
 34 #
 35 # ==> Comments added by ABS Guide author.
 36 
 37 
 38 
 39 SYMLINKDEV=/dev/diskonkey
 40 MOUNTPOINT=/mnt/diskonkey
 41 DEVLABEL=/sbin/devlabel
 42 DEVLABELCONFIG=/etc/sysconfig/devlabel
 43 IAM=$0
 44 
 45 ##
 46 # Functions lifted near-verbatim from usb-mount code.
 47 #
 48 function allAttachedScsiUsb {
 49     find /proc/scsi/ -path '/proc/scsi/usb-storage*' -type f | xargs grep -l 'Attached: Yes'
 50 }
 51 function scsiDevFromScsiUsb {
 52     echo $1 | awk -F"[-/]" '{ n=$(NF-1);  print "/dev/sd" substr("abcdefghijklmnopqrstuvwxyz", n+1,
 53  1) }'
 54 }
 55 
 56 if [ "${ACTION}" = "add" ] && [ -f "${DEVICE}" ]; then
 57     ##
 58     # lifted from usbcam code.
 59     #
 60     if [ -f /var/run/console.lock ]; then
 61         CONSOLEOWNER=`cat /var/run/console.lock`
 62     elif [ -f /var/lock/console.lock ]; then
 63         CONSOLEOWNER=`cat /var/lock/console.lock`
 64     else
 65         CONSOLEOWNER=
 66     fi
 67     for procEntry in $(allAttachedScsiUsb); do
 68         scsiDev=$(scsiDevFromScsiUsb $procEntry)
 69         #  Some bug with usb-storage?
 70         #  Partitions are not in /proc/partitions until they are accessed
 71         #+ somehow.
 72         /sbin/fdisk -l $scsiDev >/dev/null
 73         ##
 74         #  Most devices have partitioning info, so the data would be on
 75         #+ /dev/sd?1\. However, some stupider ones don't have any partitioning
 76         #+ and use the entire device for data storage. This tries to
 77         #+ guess semi-intelligently if we have a /dev/sd?1 and if not, then
 78         #+ it uses the entire device and hopes for the better.
 79         #
 80         if grep -q `basename $scsiDev`1 /proc/partitions; then
 81             part="$scsiDev""1"
 82         else
 83             part=$scsiDev
 84         fi
 85         ##
 86         #  Change ownership of the partition to the console user so they can
 87         #+ mount it.
 88         #
 89         if [ ! -z "$CONSOLEOWNER" ]; then
 90             chown $CONSOLEOWNER:disk $part
 91         fi
 92         ##
 93         # This checks if we already have this UUID defined with devlabel.
 94         # If not, it then adds the device to the list.
 95         #
 96         prodid=`$DEVLABEL printid -d $part`
 97         if ! grep -q $prodid $DEVLABELCONFIG; then
 98             # cross our fingers and hope it works
 99             $DEVLABEL add -d $part -s $SYMLINKDEV 2>/dev/null
100         fi
101         ##
102         # Check if the mount point exists and create if it doesn't.
103         #
104         if [ ! -e $MOUNTPOINT ]; then
105             mkdir -p $MOUNTPOINT
106         fi
107         ##
108         # Take care of /etc/fstab so mounting is easy.
109         #
110         if ! grep -q "^$SYMLINKDEV" /etc/fstab; then
111             # Add an fstab entry
112             echo -e \
113                 "$SYMLINKDEV\t\t$MOUNTPOINT\t\tauto\tnoauto,owner,kudzu 0 0" \
114                 >> /etc/fstab
115         fi
116     done
117     if [ ! -z "$REMOVER" ]; then
118         ##
119         # Make sure this script is triggered on device removal.
120         #
121         mkdir -p `dirname $REMOVER`
122         ln -s $IAM $REMOVER
123     fi
124 elif [ "${ACTION}" = "remove" ]; then
125     ##
126     # If the device is mounted, unmount it cleanly.
127     #
128     if grep -q "$MOUNTPOINT" /etc/mtab; then
129         # unmount cleanly
130         umount -l $MOUNTPOINT
131     fi
132     ##
133     # Remove it from /etc/fstab if it's there.
134     #
135     if grep -q "^$SYMLINKDEV" /etc/fstab; then
136         grep -v "^$SYMLINKDEV" /etc/fstab > /etc/.fstab.new
137         mv -f /etc/.fstab.new /etc/fstab
138     fi
139 fi
140 
141 exit 0</pre>

 |

* * *

这个脚本对于站点管理员来说很有用: 这是一个可以保存weblog的脚本.

* * *

**例子 A-25\. 保存weblog**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # archiveweblogs.sh v1.0
  3 
  4 # Troy Engel <tengel@fluid.com>
  5 # Slightly modified by document author.
  6 # Used with permission.
  7 #
  8 #  This script will preserve the normally rotated and
  9 #+ thrown away weblogs from a default RedHat/Apache installation.
 10 #  It will save the files with a date/time stamp in the filename,
 11 #+ bzipped, to a given directory.
 12 #
 13 #  Run this from crontab nightly at an off hour,
 14 #+ as bzip2 can suck up some serious CPU on huge logs:
 15 #  0 2 * * * /opt/sbin/archiveweblogs.sh
 16 
 17 
 18 PROBLEM=66
 19 
 20 # Set this to your backup dir.
 21 BKP_DIR=/opt/backups/weblogs
 22 
 23 # Default Apache/RedHat stuff
 24 LOG_DAYS="4 3 2 1"
 25 LOG_DIR=/var/log/httpd
 26 LOG_FILES="access_log error_log"
 27 
 28 # Default RedHat program locations
 29 LS=/bin/ls
 30 MV=/bin/mv
 31 ID=/usr/bin/id
 32 CUT=/bin/cut
 33 COL=/usr/bin/column
 34 BZ2=/usr/bin/bzip2
 35 
 36 # Are we root?
 37 USER=`$ID -u`
 38 if [ "X$USER" != "X0" ]; then
 39   echo "PANIC: Only root can run this script!"
 40   exit $PROBLEM
 41 fi
 42 
 43 # Backup dir exists/writable?
 44 if [ ! -x $BKP_DIR ]; then
 45   echo "PANIC: $BKP_DIR doesn't exist or isn't writable!"
 46   exit $PROBLEM
 47 fi
 48 
 49 # Move, rename and bzip2 the logs
 50 for logday in $LOG_DAYS; do
 51   for logfile in $LOG_FILES; do
 52     MYFILE="$LOG_DIR/$logfile.$logday"
 53     if [ -w $MYFILE ]; then
 54       DTS=`$LS -lgo --time-style=+%Y%m%d $MYFILE | $COL -t | $CUT -d ' ' -f7`
 55       $MV $MYFILE $BKP_DIR/$logfile.$DTS
 56       $BZ2 $BKP_DIR/$logfile.$DTS
 57     else
 58       # Only spew an error if the file exits (ergo non-writable).
 59       if [ -f $MYFILE ]; then
 60         echo "ERROR: $MYFILE not writable. Skipping."
 61       fi
 62     fi
 63   done
 64 done
 65 
 66 exit 0</pre>

 |

* * *

你怎么做才能阻止shell扩展或者重新解释字符串?

* * *

**例子 A-26\. 保护字符串的字面含义**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # protect_literal.sh
  3 
  4 # set -vx
  5 
  6 :<<-'_Protect_Literal_String_Doc'
  7 
  8     Copyright (c) Michael S. Zick, 2003; All Rights Reserved
  9     License: Unrestricted reuse in any form, for any purpose.
 10     Warranty: None
 11     Revision: $ID$
 12 
 13     Documentation redirected to the Bash no-operation.
 14     Bash will '/dev/null' this block when the script is first read.
 15     (Uncomment the above set command to see this action.)
 16 
 17     Remove the first (Sha-Bang) line when sourcing this as a library
 18     procedure.  Also comment out the example use code in the two
 19     places where shown.
 20 
 21 
 22     Usage:
 23         _protect_literal_str 'Whatever string meets your ${fancy}'
 24         Just echos the argument to standard out, hard quotes
 25         restored.
 26 
 27         $(_protect_literal_str 'Whatever string meets your ${fancy}')
 28         as the right-hand-side of an assignment statement.
 29 
 30     Does:
 31         As the right-hand-side of an assignment, preserves the
 32         hard quotes protecting the contents of the literal during
 33         assignment.
 34 
 35     Notes:
 36         The strange names (_*) are used to avoid trampling on
 37         the user's chosen names when this is sourced as a
 38         library.
 39 
 40 _Protect_Literal_String_Doc
 41 
 42 # The 'for illustration' function form
 43 
 44 _protect_literal_str() {
 45 
 46 # Pick an un-used, non-printing character as local IFS.
 47 # Not required, but shows that we are ignoring it.
 48     local IFS=/pre>\x1B'               # \ESC character
 49 
 50 # Enclose the All-Elements-Of in hard quotes during assignment.
 51     local tmp=/pre>\x27'$@/pre>\x27'
 52 #    local tmp=/pre>\''$@/pre>\''         # Even uglier.
 53 
 54     local len=${#tmp}               # Info only.
 55     echo $tmp is $len long.         # Output AND information.
 56 }
 57 
 58 # This is the short-named version.
 59 _pls() {
 60     local IFS=/pre>x1B'                # \ESC character (not required)
 61     echo /pre>\x27'$@/pre>\x27'           # Hard quoted parameter glob
 62 }
 63 
 64 # :<<-'_Protect_Literal_String_Test'
 65 # # # Remove the above "# " to disable this code. # # #
 66 
 67 # See how that looks when printed.
 68 echo
 69 echo "- - Test One - -"
 70 _protect_literal_str 'Hello $user'
 71 _protect_literal_str 'Hello "${username}"'
 72 echo
 73 
 74 # Which yields:
 75 # - - Test One - -
 76 # 'Hello $user' is 13 long.
 77 # 'Hello "${username}"' is 21 long.
 78 
 79 #  Looks as expected, but why all of the trouble?
 80 #  The difference is hidden inside the Bash internal order
 81 #+ of operations.
 82 #  Which shows when you use it on the RHS of an assignment.
 83 
 84 # Declare an array for test values.
 85 declare -a arrayZ
 86 
 87 # Assign elements with various types of quotes and escapes.
 88 arrayZ=( zero "$(_pls 'Hello ${Me}')" 'Hello ${You}' "\'Pass: ${pw}\'" )
 89 
 90 # Now list that array and see what is there.
 91 echo "- - Test Two - -"
 92 for (( i=0 ; i<${#arrayZ[*]} ; i++ ))
 93 do
 94     echo  Element $i: ${arrayZ[$i]} is: ${#arrayZ[$i]} long.
 95 done
 96 echo
 97 
 98 # Which yields:
 99 # - - Test Two - -
100 # Element 0: zero is: 4 long.           # Our marker element
101 # Element 1: 'Hello ${Me}' is: 13 long. # Our "$(_pls '...' )"
102 # Element 2: Hello ${You} is: 12 long.  # Quotes are missing
103 # Element 3: \'Pass: \' is: 10 long.    # ${pw} expanded to nothing
104 
105 # Now make an assignment with that result.
106 declare -a array2=( ${arrayZ[@]} )
107 
108 # And print what happened.
109 echo "- - Test Three - -"
110 for (( i=0 ; i<${#array2[*]} ; i++ ))
111 do
112     echo  Element $i: ${array2[$i]} is: ${#array2[$i]} long.
113 done
114 echo
115 
116 # Which yields:
117 # - - Test Three - -
118 # Element 0: zero is: 4 long.           # Our marker element.
119 # Element 1: Hello ${Me} is: 11 long.   # Intended result.
120 # Element 2: Hello is: 5 long.          # ${You} expanded to nothing.
121 # Element 3: 'Pass: is: 6 long.         # Split on the whitespace.
122 # Element 4: ' is: 1 long.              # The end quote is here now.
123 
124 #  Our Element 1 has had its leading and trailing hard quotes stripped.
125 #  Although not shown, leading and trailing whitespace is also stripped.
126 #  Now that the string contents are set, Bash will always, internally,
127 #+ hard quote the contents as required during its operations.
128 
129 #  Why?
130 #  Considering our "$(_pls 'Hello ${Me}')" construction:
131 #  " ... " -> Expansion required, strip the quotes.
132 #  $( ... ) -> Replace with the result of..., strip this.
133 #  _pls ' ... ' -> called with literal arguments, strip the quotes.
134 #  The result returned includes hard quotes; BUT the above processing
135 #+ has already been done, so they become part of the value assigned.
136 #
137 #  Similarly, during further usage of the string variable, the ${Me}
138 #+ is part of the contents (result) and survives any operations
139 #  (Until explicitly told to evaluate the string).
140 
141 #  Hint: See what happens when the hard quotes (/pre>\x27') are replaced
142 #+ with soft quotes (/pre>\x22') in the above procedures.
143 #  Interesting also is to remove the addition of any quoting.
144 
145 # _Protect_Literal_String_Test
146 # # # Remove the above "# " to disable this code. # # #
147 
148 exit 0</pre>

 |

* * *

如果你_确实想让_shell扩展或者重新解释字符串的话, 该怎么办?

* * *

**例子 A-27\. 不保护字符串的字面含义**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # unprotect_literal.sh
  3 
  4 # set -vx
  5 
  6 :<<-'_UnProtect_Literal_String_Doc'
  7 
  8     Copyright (c) Michael S. Zick, 2003; All Rights Reserved
  9     License: Unrestricted reuse in any form, for any purpose.
 10     Warranty: None
 11     Revision: $ID$
 12 
 13     Documentation redirected to the Bash no-operation. Bash will
 14     '/dev/null' this block when the script is first read.
 15     (Uncomment the above set command to see this action.)
 16 
 17     Remove the first (Sha-Bang) line when sourcing this as a library
 18     procedure.  Also comment out the example use code in the two
 19     places where shown.
 20 
 21 
 22     Usage:
 23         Complement of the "$(_pls 'Literal String')" function.
 24         (See the protect_literal.sh example.)
 25 
 26         StringVar=$(_upls ProtectedSringVariable)
 27 
 28     Does:
 29         When used on the right-hand-side of an assignment statement;
 30         makes the substitions embedded in the protected string.
 31 
 32     Notes:
 33         The strange names (_*) are used to avoid trampling on
 34         the user's chosen names when this is sourced as a
 35         library.
 36 
 37 
 38 _UnProtect_Literal_String_Doc
 39 
 40 _upls() {
 41     local IFS=/pre>x1B'                # \ESC character (not required)
 42     eval echo $@                    # Substitution on the glob.
 43 }
 44 
 45 # :<<-'_UnProtect_Literal_String_Test'
 46 # # # Remove the above "# " to disable this code. # # #
 47 
 48 
 49 _pls() {
 50     local IFS=/pre>x1B'                # \ESC character (not required)
 51     echo /pre>\x27'$@/pre>\x27'           # Hard quoted parameter glob
 52 }
 53 
 54 # Declare an array for test values.
 55 declare -a arrayZ
 56 
 57 # Assign elements with various types of quotes and escapes.
 58 arrayZ=( zero "$(_pls 'Hello ${Me}')" 'Hello ${You}' "\'Pass: ${pw}\'" )
 59 
 60 # Now make an assignment with that result.
 61 declare -a array2=( ${arrayZ[@]} )
 62 
 63 # Which yielded:
 64 # - - Test Three - -
 65 # Element 0: zero is: 4 long            # Our marker element.
 66 # Element 1: Hello ${Me} is: 11 long    # Intended result.
 67 # Element 2: Hello is: 5 long           # ${You} expanded to nothing.
 68 # Element 3: 'Pass: is: 6 long          # Split on the whitespace.
 69 # Element 4: ' is: 1 long               # The end quote is here now.
 70 
 71 # set -vx
 72 
 73 #  Initialize 'Me' to something for the embedded ${Me} substitution.
 74 #  This needs to be done ONLY just prior to evaluating the
 75 #+ protected string.
 76 #  (This is why it was protected to begin with.)
 77 
 78 Me="to the array guy."
 79 
 80 # Set a string variable destination to the result.
 81 newVar=$(_upls ${array2[1]})
 82 
 83 # Show what the contents are.
 84 echo $newVar
 85 
 86 # Do we really need a function to do this?
 87 newerVar=$(eval echo ${array2[1]})
 88 echo $newerVar
 89 
 90 #  I guess not, but the _upls function gives us a place to hang
 91 #+ the documentation on.
 92 #  This helps when we forget what a # construction like:
 93 #+ $(eval echo ... ) means.
 94 
 95 # What if Me isn't set when the protected string is evaluated?
 96 unset Me
 97 newestVar=$(_upls ${array2[1]})
 98 echo $newestVar
 99 
100 # Just gone, no hints, no runs, no errors.
101 
102 #  Why in the world?
103 #  Setting the contents of a string variable containing character
104 #+ sequences that have a meaning in Bash is a general problem in
105 #+ script programming.
106 #
107 #  This problem is now solved in eight lines of code
108 #+ (and four pages of description).
109 
110 #  Where is all this going?
111 #  Dynamic content Web pages as an array of Bash strings.
112 #  Content set per request by a Bash 'eval' command
113 #+ on the stored page template.
114 #  Not intended to replace PHP, just an interesting thing to do.
115 ###
116 #  Don't have a webserver application?
117 #  No problem, check the example directory of the Bash source;
118 #+ there is a Bash script for that also.
119 
120 # _UnProtect_Literal_String_Test
121 # # # Remove the above "# " to disable this code. # # #
122 
123 exit 0</pre>

 |

* * *

这个强大的脚本帮助我们抓住垃圾邮件服务器.

* * *

**例子 A-28\. 鉴定是否是垃圾邮件服务器**

| 

<pre class="PROGRAMLISTING">   1 #!/bin/bash
   2 
   3 # $Id: is_spammer.bash,v 1.12.2.11 2004/10/01 21:42:33 mszick Exp $
   4 # Above line is RCS info.
   5 
   6 # The latest version of this script is available from http://www.morethan.org.
   7 #
   8 # Spammer-identification
   9 # by Michael S. Zick
  10 # Used in the ABS Guide with permission.
  11 
  12 
  13 
  14 #######################################################
  15 # Documentation
  16 # See also "Quickstart" at end of script.
  17 #######################################################
  18 
  19 :<<-'__is_spammer_Doc_'
  20 
  21     Copyright (c) Michael S. Zick, 2004
  22     License: Unrestricted reuse in any form, for any purpose.
  23     Warranty: None -{Its a script; the user is on their own.}-
  24 
  25 Impatient?
  26     Application code: goto "# # # Hunt the Spammer' program code # # #"
  27     Example output: ":<<-'_is_spammer_outputs_'"
  28     How to use: Enter script name without arguments.
  29                 Or goto "Quickstart" at end of script.
  30 
  31 Provides
  32     Given a domain name or IP(v4) address as input:
  33 
  34     Does an exhaustive set of queries to find the associated
  35     network resources (short of recursing into TLDs).
  36 
  37     Checks the IP(v4) addresses found against Blacklist
  38     nameservers.
  39 
  40     If found to be a blacklisted IP(v4) address,
  41     reports the blacklist text records.
  42     (Usually hyper-links to the specific report.)
  43 
  44 Requires
  45     A working Internet connection.
  46     (Exercise: Add check and/or abort if not on-line when running script.)
  47     Bash with arrays (2.05b+).
  48 
  49     The external program 'dig' --
  50     a utility program provided with the 'bind' set of programs.
  51     Specifically, the version which is part of Bind series 9.x
  52     See: http://www.isc.org
  53 
  54     All usages of 'dig' are limited to wrapper functions,
  55     which may be rewritten as required.
  56     See: dig_wrappers.bash for details.
  57          ("Additional documentation" -- below)
  58 
  59 Usage
  60     Script requires a single argument, which may be:
  61     1) A domain name;
  62     2) An IP(v4) address;
  63     3) A filename, with one name or address per line.
  64 
  65     Script accepts an optional second argument, which may be:
  66     1) A Blacklist server name;
  67     2) A filename, with one Blacklist server name per line.
  68 
  69     If the second argument is not provided, the script uses
  70     a built-in set of (free) Blacklist servers.
  71 
  72     See also, the Quickstart at the end of this script (after 'exit').
  73 
  74 Return Codes
  75     0 - All OK
  76     1 - Script failure
  77     2 - Something is Blacklisted
  78 
  79 Optional environment variables
  80     SPAMMER_TRACE
  81         If set to a writable file,
  82         script will log an execution flow trace.
  83 
  84     SPAMMER_DATA
  85         If set to a writable file, script will dump its
  86         discovered data in the form of GraphViz file.
  87         See: http://www.research.att.com/sw/tools/graphviz
  88 
  89     SPAMMER_LIMIT
  90         Limits the depth of resource tracing.
  91 
  92         Default is 2 levels.
  93 
  94         A setting of 0 (zero) means 'unlimited' . . .
  95           Caution: script might recurse the whole Internet!
  96 
  97         A limit of 1 or 2 is most useful when processing
  98         a file of domain names and addresses.
  99         A higher limit can be useful when hunting spam gangs.
 100 
 101 
 102 Additional documentation
 103     Download the archived set of scripts
 104     explaining and illustrating the function contained within this script.
 105     http://personal.riverusers.com/mszick_clf.tar.bz2
 106 
 107 
 108 Study notes
 109     This script uses a large number of functions.
 110     Nearly all general functions have their own example script.
 111     Each of the example scripts have tutorial level comments.
 112 
 113 Scripting project
 114     Add support for IP(v6) addresses.
 115     IP(v6) addresses are recognized but not processed.
 116 
 117 Advanced project
 118     Add the reverse lookup detail to the discovered information.
 119 
 120     Report the delegation chain and abuse contacts.
 121 
 122     Modify the GraphViz file output to include the
 123     newly discovered information.
 124 
 125 __is_spammer_Doc_
 126 
 127 #######################################################
 128 
 129 
 130 
 131 
 132 #### Special IFS settings used for string parsing. ####
 133 
 134 # Whitespace == :Space:Tab:Line Feed:Carriage Return:
 135 WSP_IFS=/pre>\x20'/pre>\x09'/pre>\x0A'/pre>\x0D'
 136 
 137 # No Whitespace == Line Feed:Carriage Return
 138 NO_WSP=/pre>\x0A'/pre>\x0D'
 139 
 140 # Field separator for dotted decimal IP addresses
 141 ADR_IFS=${NO_WSP}'.'
 142 
 143 # Array to dotted string conversions
 144 DOT_IFS='.'${WSP_IFS}
 145 
 146 # # # Pending operations stack machine # # #
 147 # This set of functions described in func_stack.bash.
 148 # (See "Additional documentation" above.)
 149 # # #
 150 
 151 # Global stack of pending operations.
 152 declare -f -a _pending_
 153 # Global sentinel for stack runners
 154 declare -i _p_ctrl_
 155 # Global holder for currently executing function
 156 declare -f _pend_current_
 157 
 158 # # # Debug version only - remove for regular use # # #
 159 #
 160 # The function stored in _pend_hook_ is called
 161 # immediately before each pending function is
 162 # evaluated.  Stack clean, _pend_current_ set.
 163 #
 164 # This thingy demonstrated in pend_hook.bash.
 165 declare -f _pend_hook_
 166 # # #
 167 
 168 # The do nothing function
 169 pend_dummy() { : ; }
 170 
 171 # Clear and initialize the function stack.
 172 pend_init() {
 173     unset _pending_[@]
 174     pend_func pend_stop_mark
 175     _pend_hook_='pend_dummy'  # Debug only.
 176 }
 177 
 178 # Discard the top function on the stack.
 179 pend_pop() {
 180     if [ ${#_pending_[@]} -gt 0 ]
 181     then
 182         local -i _top_
 183         _top_=${#_pending_[@]}-1
 184         unset _pending_[$_top_]
 185     fi
 186 }
 187 
 188 # pend_func function_name [$(printf '%q\n' arguments)]
 189 pend_func() {
 190     local IFS=${NO_WSP}
 191     set -f
 192     _pending_[${#_pending_[@]}]=$@
 193     set +f
 194 }
 195 
 196 # The function which stops the release:
 197 pend_stop_mark() {
 198     _p_ctrl_=0
 199 }
 200 
 201 pend_mark() {
 202     pend_func pend_stop_mark
 203 }
 204 
 205 # Execute functions until 'pend_stop_mark' . . .
 206 pend_release() {
 207     local -i _top_             # Declare _top_ as integer.
 208     _p_ctrl_=${#_pending_[@]}
 209     while [ ${_p_ctrl_} -gt 0 ]
 210     do
 211        _top_=${#_pending_[@]}-1
 212        _pend_current_=${_pending_[$_top_]}
 213        unset _pending_[$_top_]
 214        $_pend_hook_            # Debug only.
 215        eval $_pend_current_
 216     done
 217 }
 218 
 219 # Drop functions until 'pend_stop_mark' . . .
 220 pend_drop() {
 221     local -i _top_
 222     local _pd_ctrl_=${#_pending_[@]}
 223     while [ ${_pd_ctrl_} -gt 0 ]
 224     do
 225        _top_=$_pd_ctrl_-1
 226        if [ "${_pending_[$_top_]}" == 'pend_stop_mark' ]
 227        then
 228            unset _pending_[$_top_]
 229            break
 230        else
 231            unset _pending_[$_top_]
 232            _pd_ctrl_=$_top_
 233        fi
 234     done
 235     if [ ${#_pending_[@]} -eq 0 ]
 236     then
 237         pend_func pend_stop_mark
 238     fi
 239 }
 240 
 241 #### Array editors ####
 242 
 243 # This function described in edit_exact.bash.
 244 # (See "Additional documentation," above.)
 245 # edit_exact <excludes_array_name> <target_array_name>
 246 edit_exact() {
 247     [ $# -eq 2 ] ||
 248     [ $# -eq 3 ] || return 1
 249     local -a _ee_Excludes
 250     local -a _ee_Target
 251     local _ee_x
 252     local _ee_t
 253     local IFS=${NO_WSP}
 254     set -f
 255     eval _ee_Excludes=\( \$\{$1\[@\]\} \)
 256     eval _ee_Target=\( \$\{$2\[@\]\} \)
 257     local _ee_len=${#_ee_Target[@]}     # Original length.
 258     local _ee_cnt=${#_ee_Excludes[@]}   # Exclude list length.
 259     [ ${_ee_len} -ne 0 ] || return 0    # Can't edit zero length.
 260     [ ${_ee_cnt} -ne 0 ] || return 0    # Can't edit zero length.
 261     for (( x = 0; x < ${_ee_cnt} ; x++ ))
 262     do
 263         _ee_x=${_ee_Excludes[$x]}
 264         for (( n = 0 ; n < ${_ee_len} ; n++ ))
 265         do
 266             _ee_t=${_ee_Target[$n]}
 267             if [ x"${_ee_t}" == x"${_ee_x}" ]
 268             then
 269                 unset _ee_Target[$n]     # Discard match.
 270                 [ $# -eq 2 ] && break    # If 2 arguments, then done.
 271             fi
 272         done
 273     done
 274     eval $2=\( \$\{_ee_Target\[@\]\} \)
 275     set +f
 276     return 0
 277 }
 278 
 279 # This function described in edit_by_glob.bash.
 280 # edit_by_glob <excludes_array_name> <target_array_name>
 281 edit_by_glob() {
 282     [ $# -eq 2 ] ||
 283     [ $# -eq 3 ] || return 1
 284     local -a _ebg_Excludes
 285     local -a _ebg_Target
 286     local _ebg_x
 287     local _ebg_t
 288     local IFS=${NO_WSP}
 289     set -f
 290     eval _ebg_Excludes=\( \$\{$1\[@\]\} \)
 291     eval _ebg_Target=\( \$\{$2\[@\]\} \)
 292     local _ebg_len=${#_ebg_Target[@]}
 293     local _ebg_cnt=${#_ebg_Excludes[@]}
 294     [ ${_ebg_len} -ne 0 ] || return 0
 295     [ ${_ebg_cnt} -ne 0 ] || return 0
 296     for (( x = 0; x < ${_ebg_cnt} ; x++ ))
 297     do
 298         _ebg_x=${_ebg_Excludes[$x]}
 299         for (( n = 0 ; n < ${_ebg_len} ; n++ ))
 300         do
 301             [ $# -eq 3 ] && _ebg_x=${_ebg_x}'*'  #  Do prefix edit
 302             if [ ${_ebg_Target[$n]:=} ]          #+ if defined & set.
 303             then
 304                 _ebg_t=${_ebg_Target[$n]/#${_ebg_x}/}
 305                 [ ${#_ebg_t} -eq 0 ] && unset _ebg_Target[$n]
 306             fi
 307         done
 308     done
 309     eval $2=\( \$\{_ebg_Target\[@\]\} \)
 310     set +f
 311     return 0
 312 }
 313 
 314 # This function described in unique_lines.bash.
 315 # unique_lines <in_name> <out_name>
 316 unique_lines() {
 317     [ $# -eq 2 ] || return 1
 318     local -a _ul_in
 319     local -a _ul_out
 320     local -i _ul_cnt
 321     local -i _ul_pos
 322     local _ul_tmp
 323     local IFS=${NO_WSP}
 324     set -f
 325     eval _ul_in=\( \$\{$1\[@\]\} \)
 326     _ul_cnt=${#_ul_in[@]}
 327     for (( _ul_pos = 0 ; _ul_pos < ${_ul_cnt} ; _ul_pos++ ))
 328     do
 329         if [ ${_ul_in[${_ul_pos}]:=} ]      # If defined & not empty
 330         then
 331             _ul_tmp=${_ul_in[${_ul_pos}]}
 332             _ul_out[${#_ul_out[@]}]=${_ul_tmp}
 333             for (( zap = _ul_pos ; zap < ${_ul_cnt} ; zap++ ))
 334             do
 335                 [ ${_ul_in[${zap}]:=} ] &&
 336                 [ 'x'${_ul_in[${zap}]} == 'x'${_ul_tmp} ] &&
 337                     unset _ul_in[${zap}]
 338             done
 339         fi
 340     done
 341     eval $2=\( \$\{_ul_out\[@\]\} \)
 342     set +f
 343     return 0
 344 }
 345 
 346 # This function described in char_convert.bash.
 347 # to_lower <string>
 348 to_lower() {
 349     [ $# -eq 1 ] || return 1
 350     local _tl_out
 351     _tl_out=${1//A/a}
 352     _tl_out=${_tl_out//B/b}
 353     _tl_out=${_tl_out//C/c}
 354     _tl_out=${_tl_out//D/d}
 355     _tl_out=${_tl_out//E/e}
 356     _tl_out=${_tl_out//F/f}
 357     _tl_out=${_tl_out//G/g}
 358     _tl_out=${_tl_out//H/h}
 359     _tl_out=${_tl_out//I/i}
 360     _tl_out=${_tl_out//J/j}
 361     _tl_out=${_tl_out//K/k}
 362     _tl_out=${_tl_out//L/l}
 363     _tl_out=${_tl_out//M/m}
 364     _tl_out=${_tl_out//N/n}
 365     _tl_out=${_tl_out//O/o}
 366     _tl_out=${_tl_out//P/p}
 367     _tl_out=${_tl_out//Q/q}
 368     _tl_out=${_tl_out//R/r}
 369     _tl_out=${_tl_out//S/s}
 370     _tl_out=${_tl_out//T/t}
 371     _tl_out=${_tl_out//U/u}
 372     _tl_out=${_tl_out//V/v}
 373     _tl_out=${_tl_out//W/w}
 374     _tl_out=${_tl_out//X/x}
 375     _tl_out=${_tl_out//Y/y}
 376     _tl_out=${_tl_out//Z/z}
 377     echo ${_tl_out}
 378     return 0
 379 }
 380 
 381 #### Application helper functions ####
 382 
 383 # Not everybody uses dots as separators (APNIC, for example).
 384 # This function described in to_dot.bash
 385 # to_dot <string>
 386 to_dot() {
 387     [ $# -eq 1 ] || return 1
 388     echo ${1//[#|@|%]/.}
 389     return 0
 390 }
 391 
 392 # This function described in is_number.bash.
 393 # is_number <input>
 394 is_number() {
 395     [ "$#" -eq 1 ]    || return 1  # is blank?
 396     [ x"$1" == 'x0' ] && return 0  # is zero?
 397     local -i tst
 398     let tst=$1 2>/dev/null         # else is numeric!
 399     return $?
 400 }
 401 
 402 # This function described in is_address.bash.
 403 # is_address <input>
 404 is_address() {
 405     [ $# -eq 1 ] || return 1    # Blank ==> false
 406     local -a _ia_input
 407     local IFS=${ADR_IFS}
 408     _ia_input=( $1 )
 409     if  [ ${#_ia_input[@]} -eq 4 ]  &&
 410         is_number ${_ia_input[0]}   &&
 411         is_number ${_ia_input[1]}   &&
 412         is_number ${_ia_input[2]}   &&
 413         is_number ${_ia_input[3]}   &&
 414         [ ${_ia_input[0]} -lt 256 ] &&
 415         [ ${_ia_input[1]} -lt 256 ] &&
 416         [ ${_ia_input[2]} -lt 256 ] &&
 417         [ ${_ia_input[3]} -lt 256 ]
 418     then
 419         return 0
 420     else
 421         return 1
 422     fi
 423 }
 424 
 425 # This function described in split_ip.bash.
 426 # split_ip <IP_address> <array_name_norm> [<array_name_rev>]
 427 split_ip() {
 428     [ $# -eq 3 ] ||              #  Either three
 429     [ $# -eq 2 ] || return 1     #+ or two arguments
 430     local -a _si_input
 431     local IFS=${ADR_IFS}
 432     _si_input=( $1 )
 433     IFS=${WSP_IFS}
 434     eval $2=\(\ \$\{_si_input\[@\]\}\ \)
 435     if [ $# -eq 3 ]
 436     then
 437         # Build query order array.
 438         local -a _dns_ip
 439         _dns_ip[0]=${_si_input[3]}
 440         _dns_ip[1]=${_si_input[2]}
 441         _dns_ip[2]=${_si_input[1]}
 442         _dns_ip[3]=${_si_input[0]}
 443         eval $3=\(\ \$\{_dns_ip\[@\]\}\ \)
 444     fi
 445     return 0
 446 }
 447 
 448 # This function described in dot_array.bash.
 449 # dot_array <array_name>
 450 dot_array() {
 451     [ $# -eq 1 ] || return 1     # Single argument required.
 452     local -a _da_input
 453     eval _da_input=\(\ \$\{$1\[@\]\}\ \)
 454     local IFS=${DOT_IFS}
 455     local _da_output=${_da_input[@]}
 456     IFS=${WSP_IFS}
 457     echo ${_da_output}
 458     return 0
 459 }
 460 
 461 # This function described in file_to_array.bash
 462 # file_to_array <file_name> <line_array_name>
 463 file_to_array() {
 464     [ $# -eq 2 ] || return 1  # Two arguments required.
 465     local IFS=${NO_WSP}
 466     local -a _fta_tmp_
 467     _fta_tmp_=( $(cat $1) )
 468     eval $2=\( \$\{_fta_tmp_\[@\]\} \)
 469     return 0
 470 }
 471 
 472 # Columnized print of an array of multi-field strings.
 473 # col_print <array_name> <min_space> <tab_stop [tab_stops]>
 474 col_print() {
 475     [ $# -gt 2 ] || return 0
 476     local -a _cp_inp
 477     local -a _cp_spc
 478     local -a _cp_line
 479     local _cp_min
 480     local _cp_mcnt
 481     local _cp_pos
 482     local _cp_cnt
 483     local _cp_tab
 484     local -i _cp
 485     local -i _cpf
 486     local _cp_fld
 487     # WARNING: FOLLOWING LINE NOT BLANK -- IT IS QUOTED SPACES.
 488     local _cp_max='                                                            '
 489     set -f
 490     local IFS=${NO_WSP}
 491     eval _cp_inp=\(\ \$\{$1\[@\]\}\ \)
 492     [ ${#_cp_inp[@]} -gt 0 ] || return 0 # Empty is easy.
 493     _cp_mcnt=$2
 494     _cp_min=${_cp_max:1:${_cp_mcnt}}
 495     shift
 496     shift
 497     _cp_cnt=$#
 498     for (( _cp = 0 ; _cp < _cp_cnt ; _cp++ ))
 499     do
 500         _cp_spc[${#_cp_spc[@]}]="${_cp_max:2:$1}" #"
 501         shift
 502     done
 503     _cp_cnt=${#_cp_inp[@]}
 504     for (( _cp = 0 ; _cp < _cp_cnt ; _cp++ ))
 505     do
 506         _cp_pos=1
 507         IFS=${NO_WSP}/pre>\x20'
 508         _cp_line=( ${_cp_inp[${_cp}]} )
 509         IFS=${NO_WSP}
 510         for (( _cpf = 0 ; _cpf < ${#_cp_line[@]} ; _cpf++ ))
 511         do
 512             _cp_tab=${_cp_spc[${_cpf}]:${_cp_pos}}
 513             if [ ${#_cp_tab} -lt ${_cp_mcnt} ]
 514             then
 515                 _cp_tab="${_cp_min}"
 516             fi
 517             echo -n "${_cp_tab}"
 518             (( _cp_pos = ${_cp_pos} + ${#_cp_tab} ))
 519             _cp_fld="${_cp_line[${_cpf}]}"
 520             echo -n ${_cp_fld}
 521             (( _cp_pos = ${_cp_pos} + ${#_cp_fld} ))
 522         done
 523         echo
 524     done
 525     set +f
 526     return 0
 527 }
 528 
 529 # # # # 'Hunt the Spammer' data flow # # # #
 530 
 531 # Application return code
 532 declare -i _hs_RC
 533 
 534 # Original input, from which IP addresses are removed
 535 # After which, domain names to check
 536 declare -a uc_name
 537 
 538 # Original input IP addresses are moved here
 539 # After which, IP addresses to check
 540 declare -a uc_address
 541 
 542 # Names against which address expansion run
 543 # Ready for name detail lookup
 544 declare -a chk_name
 545 
 546 # Addresses against which name expansion run
 547 # Ready for address detail lookup
 548 declare -a chk_address
 549 
 550 #  Recursion is depth-first-by-name.
 551 #  The expand_input_address maintains this list
 552 #+ to prohibit looking up addresses twice during
 553 #+ domain name recursion.
 554 declare -a been_there_addr
 555 been_there_addr=( '127.0.0.1' ) # Whitelist localhost
 556 
 557 # Names which we have checked (or given up on)
 558 declare -a known_name
 559 
 560 # Addresses which we have checked (or given up on)
 561 declare -a known_address
 562 
 563 #  List of zero or more Blacklist servers to check.
 564 #  Each 'known_address' will be checked against each server,
 565 #+ with negative replies and failures suppressed.
 566 declare -a list_server
 567 
 568 # Indirection limit - set to zero == no limit
 569 indirect=${SPAMMER_LIMIT:=2}
 570 
 571 # # # # 'Hunt the Spammer' information output data # # # #
 572 
 573 # Any domain name may have multiple IP addresses.
 574 # Any IP address may have multiple domain names.
 575 # Therefore, track unique address-name pairs.
 576 declare -a known_pair
 577 declare -a reverse_pair
 578 
 579 #  In addition to the data flow variables; known_address
 580 #+ known_name and list_server, the following are output to the
 581 #+ external graphics interface file.
 582 
 583 # Authority chain, parent -> SOA fields.
 584 declare -a auth_chain
 585 
 586 # Reference chain, parent name -> child name
 587 declare -a ref_chain
 588 
 589 # DNS chain - domain name -> address
 590 declare -a name_address
 591 
 592 # Name and service pairs - domain name -> service
 593 declare -a name_srvc
 594 
 595 # Name and resource pairs - domain name -> Resource Record
 596 declare -a name_resource
 597 
 598 # Parent and Child pairs - parent name -> child name
 599 # This MAY NOT be the same as the ref_chain followed!
 600 declare -a parent_child
 601 
 602 # Address and Blacklist hit pairs - address->server
 603 declare -a address_hits
 604 
 605 # Dump interface file data
 606 declare -f _dot_dump
 607 _dot_dump=pend_dummy   # Initially a no-op
 608 
 609 #  Data dump is enabled by setting the environment variable SPAMMER_DATA
 610 #+ to the name of a writable file.
 611 declare _dot_file
 612 
 613 # Helper function for the dump-to-dot-file function
 614 # dump_to_dot <array_name> <prefix>
 615 dump_to_dot() {
 616     local -a _dda_tmp
 617     local -i _dda_cnt
 618     local _dda_form='    '${2}'%04u %s\n'
 619     local IFS=${NO_WSP}
 620     eval _dda_tmp=\(\ \$\{$1\[@\]\}\ \)
 621     _dda_cnt=${#_dda_tmp[@]}
 622     if [ ${_dda_cnt} -gt 0 ]
 623     then
 624         for (( _dda = 0 ; _dda < _dda_cnt ; _dda++ ))
 625         do
 626             printf "${_dda_form}" \
 627                    "${_dda}" "${_dda_tmp[${_dda}]}" >>${_dot_file}
 628         done
 629     fi
 630 }
 631 
 632 # Which will also set _dot_dump to this function . . .
 633 dump_dot() {
 634     local -i _dd_cnt
 635     echo '# Data vintage: '$(date -R) >${_dot_file}
 636     echo '# ABS Guide: is_spammer.bash; v2, 2004-msz' >>${_dot_file}
 637     echo >>${_dot_file}
 638     echo 'digraph G {' >>${_dot_file}
 639 
 640     if [ ${#known_name[@]} -gt 0 ]
 641     then
 642         echo >>${_dot_file}
 643         echo '# Known domain name nodes' >>${_dot_file}
 644         _dd_cnt=${#known_name[@]}
 645         for (( _dd = 0 ; _dd < _dd_cnt ; _dd++ ))
 646         do
 647             printf '    N%04u [label="%s"] ;\n' \
 648                    "${_dd}" "${known_name[${_dd}]}" >>${_dot_file}
 649         done
 650     fi
 651 
 652     if [ ${#known_address[@]} -gt 0 ]
 653     then
 654         echo >>${_dot_file}
 655         echo '# Known address nodes' >>${_dot_file}
 656         _dd_cnt=${#known_address[@]}
 657         for (( _dd = 0 ; _dd < _dd_cnt ; _dd++ ))
 658         do
 659             printf '    A%04u [label="%s"] ;\n' \
 660                    "${_dd}" "${known_address[${_dd}]}" >>${_dot_file}
 661         done
 662     fi
 663 
 664     echo                                   >>${_dot_file}
 665     echo '/*'                              >>${_dot_file}
 666     echo ' * Known relationships :: User conversion to'  >>${_dot_file}
 667     echo ' * graphic form by hand or program required.'  >>${_dot_file}
 668     echo ' *'                              >>${_dot_file}
 669 
 670     if [ ${#auth_chain[@]} -gt 0 ]
 671     then
 672         echo >>${_dot_file}
 673         echo '# Authority reference edges followed and field source.'  >>${_dot_file}
 674         dump_to_dot auth_chain AC
 675     fi
 676 
 677     if [ ${#ref_chain[@]} -gt 0 ]
 678     then
 679         echo >>${_dot_file}
 680         echo '# Name reference edges followed and field source.'  >>${_dot_file}
 681         dump_to_dot ref_chain RC
 682     fi
 683 
 684     if [ ${#name_address[@]} -gt 0 ]
 685     then
 686         echo >>${_dot_file}
 687         echo '# Known name->address edges' >>${_dot_file}
 688         dump_to_dot name_address NA
 689     fi
 690 
 691     if [ ${#name_srvc[@]} -gt 0 ]
 692     then
 693         echo >>${_dot_file}
 694         echo '# Known name->service edges' >>${_dot_file}
 695         dump_to_dot name_srvc NS
 696     fi
 697 
 698     if [ ${#name_resource[@]} -gt 0 ]
 699     then
 700         echo >>${_dot_file}
 701         echo '# Known name->resource edges' >>${_dot_file}
 702         dump_to_dot name_resource NR
 703     fi
 704 
 705     if [ ${#parent_child[@]} -gt 0 ]
 706     then
 707         echo >>${_dot_file}
 708         echo '# Known parent->child edges' >>${_dot_file}
 709         dump_to_dot parent_child PC
 710     fi
 711 
 712     if [ ${#list_server[@]} -gt 0 ]
 713     then
 714         echo >>${_dot_file}
 715         echo '# Known Blacklist nodes' >>${_dot_file}
 716         _dd_cnt=${#list_server[@]}
 717         for (( _dd = 0 ; _dd < _dd_cnt ; _dd++ ))
 718         do
 719             printf '    LS%04u [label="%s"] ;\n' \
 720                    "${_dd}" "${list_server[${_dd}]}" >>${_dot_file}
 721         done
 722     fi
 723 
 724     unique_lines address_hits address_hits
 725     if [ ${#address_hits[@]} -gt 0 ]
 726     then
 727         echo >>${_dot_file}
 728         echo '# Known address->Blacklist_hit edges' >>${_dot_file}
 729         echo '# CAUTION: dig warnings can trigger false hits.' >>${_dot_file}
 730         dump_to_dot address_hits AH
 731     fi
 732     echo          >>${_dot_file}
 733     echo ' *'     >>${_dot_file}
 734     echo ' * That is a lot of relationships. Happy graphing.' >>${_dot_file}
 735     echo ' */'    >>${_dot_file}
 736     echo '}'      >>${_dot_file}
 737     return 0
 738 }
 739 
 740 # # # # 'Hunt the Spammer' execution flow # # # #
 741 
 742 #  Execution trace is enabled by setting the
 743 #+ environment variable SPAMMER_TRACE to the name of a writable file.
 744 declare -a _trace_log
 745 declare _log_file
 746 
 747 # Function to fill the trace log
 748 trace_logger() {
 749     _trace_log[${#_trace_log[@]}]=${_pend_current_}
 750 }
 751 
 752 # Dump trace log to file function variable.
 753 declare -f _log_dump
 754 _log_dump=pend_dummy   # Initially a no-op.
 755 
 756 # Dump the trace log to a file.
 757 dump_log() {
 758     local -i _dl_cnt
 759     _dl_cnt=${#_trace_log[@]}
 760     for (( _dl = 0 ; _dl < _dl_cnt ; _dl++ ))
 761     do
 762         echo ${_trace_log[${_dl}]} >> ${_log_file}
 763     done
 764     _dl_cnt=${#_pending_[@]}
 765     if [ ${_dl_cnt} -gt 0 ]
 766     then
 767         _dl_cnt=${_dl_cnt}-1
 768         echo '# # # Operations stack not empty # # #' >> ${_log_file}
 769         for (( _dl = ${_dl_cnt} ; _dl >= 0 ; _dl-- ))
 770         do
 771             echo ${_pending_[${_dl}]} >> ${_log_file}
 772         done
 773     fi
 774 }
 775 
 776 # # # Utility program 'dig' wrappers # # #
 777 #
 778 #  These wrappers are derived from the
 779 #+ examples shown in dig_wrappers.bash.
 780 #
 781 #  The major difference is these return
 782 #+ their results as a list in an array.
 783 #
 784 #  See dig_wrappers.bash for details and
 785 #+ use that script to develop any changes.
 786 #
 787 # # #
 788 
 789 # Short form answer: 'dig' parses answer.
 790 
 791 # Forward lookup :: Name -> Address
 792 # short_fwd <domain_name> <array_name>
 793 short_fwd() {
 794     local -a _sf_reply
 795     local -i _sf_rc
 796     local -i _sf_cnt
 797     IFS=${NO_WSP}
 798 echo -n '.'
 799 # echo 'sfwd: '${1}
 800     _sf_reply=( $(dig +short ${1} -c in -t a 2>/dev/null) )
 801     _sf_rc=$?
 802     if [ ${_sf_rc} -ne 0 ]
 803     then
 804         _trace_log[${#_trace_log[@]}]='# # # Lookup error '${_sf_rc}' on '${1}' # # #'
 805 # [ ${_sf_rc} -ne 9 ] && pend_drop
 806         return ${_sf_rc}
 807     else
 808         # Some versions of 'dig' return warnings on stdout.
 809         _sf_cnt=${#_sf_reply[@]}
 810         for (( _sf = 0 ; _sf < ${_sf_cnt} ; _sf++ ))
 811         do
 812             [ 'x'${_sf_reply[${_sf}]:0:2} == 'x;;' ] &&
 813                 unset _sf_reply[${_sf}]
 814         done
 815         eval $2=\( \$\{_sf_reply\[@\]\} \)
 816     fi
 817     return 0
 818 }
 819 
 820 # Reverse lookup :: Address -> Name
 821 # short_rev <ip_address> <array_name>
 822 short_rev() {
 823     local -a _sr_reply
 824     local -i _sr_rc
 825     local -i _sr_cnt
 826     IFS=${NO_WSP}
 827 echo -n '.'
 828 # echo 'srev: '${1}
 829     _sr_reply=( $(dig +short -x ${1} 2>/dev/null) )
 830     _sr_rc=$?
 831     if [ ${_sr_rc} -ne 0 ]
 832     then
 833         _trace_log[${#_trace_log[@]}]='# # # Lookup error '${_sr_rc}' on '${1}' # # #'
 834 # [ ${_sr_rc} -ne 9 ] && pend_drop
 835         return ${_sr_rc}
 836     else
 837         # Some versions of 'dig' return warnings on stdout.
 838         _sr_cnt=${#_sr_reply[@]}
 839         for (( _sr = 0 ; _sr < ${_sr_cnt} ; _sr++ ))
 840         do
 841             [ 'x'${_sr_reply[${_sr}]:0:2} == 'x;;' ] &&
 842                 unset _sr_reply[${_sr}]
 843         done
 844         eval $2=\( \$\{_sr_reply\[@\]\} \)
 845     fi
 846     return 0
 847 }
 848 
 849 # Special format lookup used to query blacklist servers.
 850 # short_text <ip_address> <array_name>
 851 short_text() {
 852     local -a _st_reply
 853     local -i _st_rc
 854     local -i _st_cnt
 855     IFS=${NO_WSP}
 856 # echo 'stxt: '${1}
 857     _st_reply=( $(dig +short ${1} -c in -t txt 2>/dev/null) )
 858     _st_rc=$?
 859     if [ ${_st_rc} -ne 0 ]
 860     then
 861         _trace_log[${#_trace_log[@]}]='# # # Text lookup error '${_st_rc}' on '${1}' # # #'
 862 # [ ${_st_rc} -ne 9 ] && pend_drop
 863         return ${_st_rc}
 864     else
 865         # Some versions of 'dig' return warnings on stdout.
 866         _st_cnt=${#_st_reply[@]}
 867         for (( _st = 0 ; _st < ${#_st_cnt} ; _st++ ))
 868         do
 869             [ 'x'${_st_reply[${_st}]:0:2} == 'x;;' ] &&
 870                 unset _st_reply[${_st}]
 871         done
 872         eval $2=\( \$\{_st_reply\[@\]\} \)
 873     fi
 874     return 0
 875 }
 876 
 877 # The long forms, a.k.a., the parse it yourself versions
 878 
 879 # RFC 2782   Service lookups
 880 # dig +noall +nofail +answer _ldap._tcp.openldap.org -t srv
 881 # _<service>._<protocol>.<domain_name>
 882 # _ldap._tcp.openldap.org. 3600   IN      SRV     0 0 389 ldap.openldap.org.
 883 # domain TTL Class SRV Priority Weight Port Target
 884 
 885 # Forward lookup :: Name -> poor man's zone transfer
 886 # long_fwd <domain_name> <array_name>
 887 long_fwd() {
 888     local -a _lf_reply
 889     local -i _lf_rc
 890     local -i _lf_cnt
 891     IFS=${NO_WSP}
 892 echo -n ':'
 893 # echo 'lfwd: '${1}
 894     _lf_reply=( $(
 895         dig +noall +nofail +answer +authority +additional \
 896             ${1} -t soa ${1} -t mx ${1} -t any 2>/dev/null) )
 897     _lf_rc=$?
 898     if [ ${_lf_rc} -ne 0 ]
 899     then
 900         _trace_log[${#_trace_log[@]}]='# # # Zone lookup error '${_lf_rc}' on '${1}' # # #'
 901 # [ ${_lf_rc} -ne 9 ] && pend_drop
 902         return ${_lf_rc}
 903     else
 904         # Some versions of 'dig' return warnings on stdout.
 905         _lf_cnt=${#_lf_reply[@]}
 906         for (( _lf = 0 ; _lf < ${_lf_cnt} ; _lf++ ))
 907         do
 908             [ 'x'${_lf_reply[${_lf}]:0:2} == 'x;;' ] &&
 909                 unset _lf_reply[${_lf}]
 910         done
 911         eval $2=\( \$\{_lf_reply\[@\]\} \)
 912     fi
 913     return 0
 914 }
 915 #   The reverse lookup domain name corresponding to the IPv6 address:
 916 #       4321:0:1:2:3:4:567:89ab
 917 #   would be (nibble, I.E: Hexdigit) reversed:
 918 #   b.a.9.8.7.6.5.0.4.0.0.0.3.0.0.0.2.0.0.0.1.0.0.0.0.0.0.0.1.2.3.4.IP6.ARPA.
 919 
 920 # Reverse lookup :: Address -> poor man's delegation chain
 921 # long_rev <rev_ip_address> <array_name>
 922 long_rev() {
 923     local -a _lr_reply
 924     local -i _lr_rc
 925     local -i _lr_cnt
 926     local _lr_dns
 927     _lr_dns=${1}'.in-addr.arpa.'
 928     IFS=${NO_WSP}
 929 echo -n ':'
 930 # echo 'lrev: '${1}
 931     _lr_reply=( $(
 932          dig +noall +nofail +answer +authority +additional \
 933              ${_lr_dns} -t soa ${_lr_dns} -t any 2>/dev/null) )
 934     _lr_rc=$?
 935     if [ ${_lr_rc} -ne 0 ]
 936     then
 937         _trace_log[${#_trace_log[@]}]='# # # Delegation lookup error '${_lr_rc}' on '${1}' # # #'
 938 # [ ${_lr_rc} -ne 9 ] && pend_drop
 939         return ${_lr_rc}
 940     else
 941         # Some versions of 'dig' return warnings on stdout.
 942         _lr_cnt=${#_lr_reply[@]}
 943         for (( _lr = 0 ; _lr < ${_lr_cnt} ; _lr++ ))
 944         do
 945             [ 'x'${_lr_reply[${_lr}]:0:2} == 'x;;' ] &&
 946                 unset _lr_reply[${_lr}]
 947         done
 948         eval $2=\( \$\{_lr_reply\[@\]\} \)
 949     fi
 950     return 0
 951 }
 952 
 953 # # # Application specific functions # # #
 954 
 955 # Mung a possible name; suppresses root and TLDs.
 956 # name_fixup <string>
 957 name_fixup(){
 958     local -a _nf_tmp
 959     local -i _nf_end
 960     local _nf_str
 961     local IFS
 962     _nf_str=$(to_lower ${1})
 963     _nf_str=$(to_dot ${_nf_str})
 964     _nf_end=${#_nf_str}-1
 965     [ ${_nf_str:${_nf_end}} != '.' ] &&
 966         _nf_str=${_nf_str}'.'
 967     IFS=${ADR_IFS}
 968     _nf_tmp=( ${_nf_str} )
 969     IFS=${WSP_IFS}
 970     _nf_end=${#_nf_tmp[@]}
 971     case ${_nf_end} in
 972     0) # No dots, only dots.
 973         echo
 974         return 1
 975     ;;
 976     1) # Only a TLD.
 977         echo
 978         return 1
 979     ;;
 980     2) # Maybe okay.
 981        echo ${_nf_str}
 982        return 0
 983        # Needs a lookup table?
 984        if [ ${#_nf_tmp[1]} -eq 2 ]
 985        then # Country coded TLD.
 986            echo
 987            return 1
 988        else
 989            echo ${_nf_str}
 990            return 0
 991        fi
 992     ;;
 993     esac
 994     echo ${_nf_str}
 995     return 0
 996 }
 997 
 998 # Grope and mung original input(s).
 999 split_input() {
1000     [ ${#uc_name[@]} -gt 0 ] || return 0
1001     local -i _si_cnt
1002     local -i _si_len
1003     local _si_str
1004     unique_lines uc_name uc_name
1005     _si_cnt=${#uc_name[@]}
1006     for (( _si = 0 ; _si < _si_cnt ; _si++ ))
1007     do
1008         _si_str=${uc_name[$_si]}
1009         if is_address ${_si_str}
1010         then
1011             uc_address[${#uc_address[@]}]=${_si_str}
1012             unset uc_name[$_si]
1013         else
1014             if ! uc_name[$_si]=$(name_fixup ${_si_str})
1015             then
1016                 unset ucname[$_si]
1017             fi
1018         fi
1019     done
1020     uc_name=( ${uc_name[@]} )
1021     _si_cnt=${#uc_name[@]}
1022     _trace_log[${#_trace_log[@]}]='# # # Input '${_si_cnt}' unchecked name input(s). # # #'
1023     _si_cnt=${#uc_address[@]}
1024     _trace_log[${#_trace_log[@]}]='# # # Input '${_si_cnt}' unchecked address input(s). # # #'
1025     return 0
1026 }
1027 
1028 # # # Discovery functions -- recursively interlocked by external data # # #
1029 # # # The leading 'if list is empty; return 0' in each is required. # # #
1030 
1031 # Recursion limiter
1032 # limit_chk() <next_level>
1033 limit_chk() {
1034     local -i _lc_lmt
1035     # Check indirection limit.
1036     if [ ${indirect} -eq 0 ] || [ $# -eq 0 ]
1037     then
1038         # The 'do-forever' choice
1039         echo 1                 # Any value will do.
1040         return 0               # OK to continue.
1041     else
1042         # Limiting is in effect.
1043         if [ ${indirect} -lt ${1} ]
1044         then
1045             echo ${1}          # Whatever.
1046             return 1           # Stop here.
1047         else
1048             _lc_lmt=${1}+1     # Bump the given limit.
1049             echo ${_lc_lmt}    # Echo it.
1050             return 0           # OK to continue.
1051         fi
1052     fi
1053 }
1054 
1055 # For each name in uc_name:
1056 #     Move name to chk_name.
1057 #     Add addresses to uc_address.
1058 #     Pend expand_input_address.
1059 #     Repeat until nothing new found.
1060 # expand_input_name <indirection_limit>
1061 expand_input_name() {
1062     [ ${#uc_name[@]} -gt 0 ] || return 0
1063     local -a _ein_addr
1064     local -a _ein_new
1065     local -i _ucn_cnt
1066     local -i _ein_cnt
1067     local _ein_tst
1068     _ucn_cnt=${#uc_name[@]}
1069 
1070     if  ! _ein_cnt=$(limit_chk ${1})
1071     then
1072         return 0
1073     fi
1074 
1075     for (( _ein = 0 ; _ein < _ucn_cnt ; _ein++ ))
1076     do
1077         if short_fwd ${uc_name[${_ein}]} _ein_new
1078         then
1079             for (( _ein_cnt = 0 ; _ein_cnt < ${#_ein_new[@]}; _ein_cnt++ ))
1080             do
1081                 _ein_tst=${_ein_new[${_ein_cnt}]}
1082                 if is_address ${_ein_tst}
1083                 then
1084                     _ein_addr[${#_ein_addr[@]}]=${_ein_tst}
1085                 fi
1086            done
1087         fi
1088     done
1089     unique_lines _ein_addr _ein_addr     # Scrub duplicates.
1090     edit_exact chk_address _ein_addr     # Scrub pending detail.
1091     edit_exact known_address _ein_addr   # Scrub already detailed.
1092     if [ ${#_ein_addr[@]} -gt 0 ]        # Anything new?
1093     then
1094         uc_address=( ${uc_address[@]} ${_ein_addr[@]} )
1095         pend_func expand_input_address ${1}
1096         _trace_log[${#_trace_log[@]}]='# # # Added '${#_ein_addr[@]}' unchecked address input(s). # # #'
1097     fi
1098     edit_exact chk_name uc_name          # Scrub pending detail.
1099     edit_exact known_name uc_name        # Scrub already detailed.
1100     if [ ${#uc_name[@]} -gt 0 ]
1101     then
1102         chk_name=( ${chk_name[@]} ${uc_name[@]}  )
1103         pend_func detail_each_name ${1}
1104     fi
1105     unset uc_name[@]
1106     return 0
1107 }
1108 
1109 # For each address in uc_address:
1110 #     Move address to chk_address.
1111 #     Add names to uc_name.
1112 #     Pend expand_input_name.
1113 #     Repeat until nothing new found.
1114 # expand_input_address <indirection_limit>
1115 expand_input_address() {
1116     [ ${#uc_address[@]} -gt 0 ] || return 0
1117     local -a _eia_addr
1118     local -a _eia_name
1119     local -a _eia_new
1120     local -i _uca_cnt
1121     local -i _eia_cnt
1122     local _eia_tst
1123     unique_lines uc_address _eia_addr
1124     unset uc_address[@]
1125     edit_exact been_there_addr _eia_addr
1126     _uca_cnt=${#_eia_addr[@]}
1127     [ ${_uca_cnt} -gt 0 ] &&
1128         been_there_addr=( ${been_there_addr[@]} ${_eia_addr[@]} )
1129 
1130     for (( _eia = 0 ; _eia < _uca_cnt ; _eia++ ))
1131     do
1132             if short_rev ${_eia_addr[${_eia}]} _eia_new
1133             then
1134                 for (( _eia_cnt = 0 ; _eia_cnt < ${#_eia_new[@]} ; _eia_cnt++ ))
1135                 do
1136                     _eia_tst=${_eia_new[${_eia_cnt}]}
1137                     if _eia_tst=$(name_fixup ${_eia_tst})
1138                     then
1139                         _eia_name[${#_eia_name[@]}]=${_eia_tst}
1140                     fi
1141                 done
1142             fi
1143     done
1144     unique_lines _eia_name _eia_name     # Scrub duplicates.
1145     edit_exact chk_name _eia_name        # Scrub pending detail.
1146     edit_exact known_name _eia_name      # Scrub already detailed.
1147     if [ ${#_eia_name[@]} -gt 0 ]        # Anything new?
1148     then
1149         uc_name=( ${uc_name[@]} ${_eia_name[@]} )
1150         pend_func expand_input_name ${1}
1151         _trace_log[${#_trace_log[@]}]='# # # Added '${#_eia_name[@]}' unchecked name input(s). # # #'
1152     fi
1153     edit_exact chk_address _eia_addr     # Scrub pending detail.
1154     edit_exact known_address _eia_addr   # Scrub already detailed.
1155     if [ ${#_eia_addr[@]} -gt 0 ]        # Anything new?
1156     then
1157         chk_address=( ${chk_address[@]} ${_eia_addr[@]} )
1158         pend_func detail_each_address ${1}
1159     fi
1160     return 0
1161 }
1162 
1163 # The parse-it-yourself zone reply.
1164 # The input is the chk_name list.
1165 # detail_each_name <indirection_limit>
1166 detail_each_name() {
1167     [ ${#chk_name[@]} -gt 0 ] || return 0
1168     local -a _den_chk       # Names to check
1169     local -a _den_name      # Names found here
1170     local -a _den_address   # Addresses found here
1171     local -a _den_pair      # Pairs found here
1172     local -a _den_rev       # Reverse pairs found here
1173     local -a _den_tmp       # Line being parsed
1174     local -a _den_auth      # SOA contact being parsed
1175     local -a _den_new       # The zone reply
1176     local -a _den_pc        # Parent-Child gets big fast
1177     local -a _den_ref       # So does reference chain
1178     local -a _den_nr        # Name-Resource can be big
1179     local -a _den_na        # Name-Address
1180     local -a _den_ns        # Name-Service
1181     local -a _den_achn      # Chain of Authority
1182     local -i _den_cnt       # Count of names to detail
1183     local -i _den_lmt       # Indirection limit
1184     local _den_who          # Named being processed
1185     local _den_rec          # Record type being processed
1186     local _den_cont         # Contact domain
1187     local _den_str          # Fixed up name string
1188     local _den_str2         # Fixed up reverse
1189     local IFS=${WSP_IFS}
1190 
1191     # Local, unique copy of names to check
1192     unique_lines chk_name _den_chk
1193     unset chk_name[@]       # Done with globals.
1194 
1195     # Less any names already known
1196     edit_exact known_name _den_chk
1197     _den_cnt=${#_den_chk[@]}
1198 
1199     # If anything left, add to known_name.
1200     [ ${_den_cnt} -gt 0 ] &&
1201         known_name=( ${known_name[@]} ${_den_chk[@]} )
1202 
1203     # for the list of (previously) unknown names . . .
1204     for (( _den = 0 ; _den < _den_cnt ; _den++ ))
1205     do
1206         _den_who=${_den_chk[${_den}]}
1207         if long_fwd ${_den_who} _den_new
1208         then
1209             unique_lines _den_new _den_new
1210             if [ ${#_den_new[@]} -eq 0 ]
1211             then
1212                 _den_pair[${#_den_pair[@]}]='0.0.0.0 '${_den_who}
1213             fi
1214 
1215             # Parse each line in the reply.
1216             for (( _line = 0 ; _line < ${#_den_new[@]} ; _line++ ))
1217             do
1218                 IFS=${NO_WSP}/pre>\x09'/pre>\x20'
1219                 _den_tmp=( ${_den_new[${_line}]} )
1220                 IFS=${WSP_IFS}
1221                 # If usable record and not a warning message . . .
1222                 if [ ${#_den_tmp[@]} -gt 4 ] && [ 'x'${_den_tmp[0]} != 'x;;' ]
1223                 then
1224                     _den_rec=${_den_tmp[3]}
1225                     _den_nr[${#_den_nr[@]}]=${_den_who}' '${_den_rec}
1226                     # Begin at RFC1033 (+++)
1227                     case ${_den_rec} in
1228 
1229                          #<name>  [<ttl>]  [<class>]  SOA  <origin>  <person>
1230                     SOA) # Start Of Authority
1231                         if _den_str=$(name_fixup ${_den_tmp[0]})
1232                         then
1233                             _den_name[${#_den_name[@]}]=${_den_str}
1234                             _den_achn[${#_den_achn[@]}]=${_den_who}' '${_den_str}' SOA'
1235                             # SOA origin -- domain name of master zone record
1236                             if _den_str2=$(name_fixup ${_den_tmp[4]})
1237                             then
1238                                 _den_name[${#_den_name[@]}]=${_den_str2}
1239                                 _den_achn[${#_den_achn[@]}]=${_den_who}' '${_den_str2}' SOA.O'
1240                             fi
1241                             # Responsible party e-mail address (possibly bogus).
1242                             # Possibility of first.last@domain.name ignored.
1243                             set -f
1244                             if _den_str2=$(name_fixup ${_den_tmp[5]})
1245                             then
1246                                 IFS=${ADR_IFS}
1247                                 _den_auth=( ${_den_str2} )
1248                                 IFS=${WSP_IFS}
1249                                 if [ ${#_den_auth[@]} -gt 2 ]
1250                                 then
1251                                      _den_cont=${_den_auth[1]}
1252                                      for (( _auth = 2 ; _auth < ${#_den_auth[@]} ; _auth++ ))
1253                                      do
1254                                        _den_cont=${_den_cont}'.'${_den_auth[${_auth}]}
1255                                      done
1256                                      _den_name[${#_den_name[@]}]=${_den_cont}'.'
1257                                      _den_achn[${#_den_achn[@]}]=${_den_who}' '${_den_cont}'. SOA.C'
1258                                 fi
1259                             fi
1260                             set +f
1261                         fi
1262                     ;;
1263 
1264 
1265                     A) # IP(v4) Address Record
1266                         if _den_str=$(name_fixup ${_den_tmp[0]})
1267                         then
1268                             _den_name[${#_den_name[@]}]=${_den_str}
1269                             _den_pair[${#_den_pair[@]}]=${_den_tmp[4]}' '${_den_str}
1270                             _den_na[${#_den_na[@]}]=${_den_str}' '${_den_tmp[4]}
1271                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' A'
1272                         else
1273                             _den_pair[${#_den_pair[@]}]=${_den_tmp[4]}' unknown.domain'
1274                             _den_na[${#_den_na[@]}]='unknown.domain '${_den_tmp[4]}
1275                             _den_ref[${#_den_ref[@]}]=${_den_who}' unknown.domain A'
1276                         fi
1277                         _den_address[${#_den_address[@]}]=${_den_tmp[4]}
1278                         _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_tmp[4]}
1279                     ;;
1280 
1281                     NS) # Name Server Record
1282                         # Domain name being serviced (may be other than current)
1283                         if _den_str=$(name_fixup ${_den_tmp[0]})
1284                         then
1285                             _den_name[${#_den_name[@]}]=${_den_str}
1286                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' NS'
1287 
1288                             # Domain name of service provider
1289                             if _den_str2=$(name_fixup ${_den_tmp[4]})
1290                             then
1291                                 _den_name[${#_den_name[@]}]=${_den_str2}
1292                                 _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str2}' NSH'
1293                                 _den_ns[${#_den_ns[@]}]=${_den_str2}' NS'
1294                                 _den_pc[${#_den_pc[@]}]=${_den_str}' '${_den_str2}
1295                             fi
1296                         fi
1297                     ;;
1298 
1299                     MX) # Mail Server Record
1300                         # Domain name being serviced (wildcards not handled here)
1301                         if _den_str=$(name_fixup ${_den_tmp[0]})
1302                         then
1303                             _den_name[${#_den_name[@]}]=${_den_str}
1304                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' MX'
1305                         fi
1306                         # Domain name of service provider
1307                         if _den_str=$(name_fixup ${_den_tmp[5]})
1308                         then
1309                             _den_name[${#_den_name[@]}]=${_den_str}
1310                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' MXH'
1311                             _den_ns[${#_den_ns[@]}]=${_den_str}' MX'
1312                             _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_str}
1313                         fi
1314                     ;;
1315 
1316                     PTR) # Reverse address record
1317                          # Special name
1318                         if _den_str=$(name_fixup ${_den_tmp[0]})
1319                         then
1320                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' PTR'
1321                             # Host name (not a CNAME)
1322                             if _den_str2=$(name_fixup ${_den_tmp[4]})
1323                             then
1324                                 _den_rev[${#_den_rev[@]}]=${_den_str}' '${_den_str2}
1325                                 _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str2}' PTRH'
1326                                 _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_str}
1327                             fi
1328                         fi
1329                     ;;
1330 
1331                     AAAA) # IP(v6) Address Record
1332                         if _den_str=$(name_fixup ${_den_tmp[0]})
1333                         then
1334                             _den_name[${#_den_name[@]}]=${_den_str}
1335                             _den_pair[${#_den_pair[@]}]=${_den_tmp[4]}' '${_den_str}
1336                             _den_na[${#_den_na[@]}]=${_den_str}' '${_den_tmp[4]}
1337                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' AAAA'
1338                         else
1339                             _den_pair[${#_den_pair[@]}]=${_den_tmp[4]}' unknown.domain'
1340                             _den_na[${#_den_na[@]}]='unknown.domain '${_den_tmp[4]}
1341                             _den_ref[${#_den_ref[@]}]=${_den_who}' unknown.domain'
1342                         fi
1343                         # No processing for IPv6 addresses
1344                             _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_tmp[4]}
1345                     ;;
1346 
1347                     CNAME) # Alias name record
1348                            # Nickname
1349                         if _den_str=$(name_fixup ${_den_tmp[0]})
1350                         then
1351                             _den_name[${#_den_name[@]}]=${_den_str}
1352                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' CNAME'
1353                             _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_str}
1354                         fi
1355                         # Hostname
1356                         if _den_str=$(name_fixup ${_den_tmp[4]})
1357                         then
1358                             _den_name[${#_den_name[@]}]=${_den_str}
1359                             _den_ref[${#_den_ref[@]}]=${_den_who}' '${_den_str}' CHOST'
1360                             _den_pc[${#_den_pc[@]}]=${_den_who}' '${_den_str}
1361                         fi
1362                     ;;
1363 #                   TXT)
1364 #                   ;;
1365                     esac
1366                 fi
1367             done
1368         else # Lookup error == 'A' record 'unknown address'
1369             _den_pair[${#_den_pair[@]}]='0.0.0.0 '${_den_who}
1370         fi
1371     done
1372 
1373     # Control dot array growth.
1374     unique_lines _den_achn _den_achn      # Works best, all the same.
1375     edit_exact auth_chain _den_achn       # Works best, unique items.
1376     if [ ${#_den_achn[@]} -gt 0 ]
1377     then
1378         IFS=${NO_WSP}
1379         auth_chain=( ${auth_chain[@]} ${_den_achn[@]} )
1380         IFS=${WSP_IFS}
1381     fi
1382 
1383     unique_lines _den_ref _den_ref      # Works best, all the same.
1384     edit_exact ref_chain _den_ref       # Works best, unique items.
1385     if [ ${#_den_ref[@]} -gt 0 ]
1386     then
1387         IFS=${NO_WSP}
1388         ref_chain=( ${ref_chain[@]} ${_den_ref[@]} )
1389         IFS=${WSP_IFS}
1390     fi
1391 
1392     unique_lines _den_na _den_na
1393     edit_exact name_address _den_na
1394     if [ ${#_den_na[@]} -gt 0 ]
1395     then
1396         IFS=${NO_WSP}
1397         name_address=( ${name_address[@]} ${_den_na[@]} )
1398         IFS=${WSP_IFS}
1399     fi
1400 
1401     unique_lines _den_ns _den_ns
1402     edit_exact name_srvc _den_ns
1403     if [ ${#_den_ns[@]} -gt 0 ]
1404     then
1405         IFS=${NO_WSP}
1406         name_srvc=( ${name_srvc[@]} ${_den_ns[@]} )
1407         IFS=${WSP_IFS}
1408     fi
1409 
1410     unique_lines _den_nr _den_nr
1411     edit_exact name_resource _den_nr
1412     if [ ${#_den_nr[@]} -gt 0 ]
1413     then
1414         IFS=${NO_WSP}
1415         name_resource=( ${name_resource[@]} ${_den_nr[@]} )
1416         IFS=${WSP_IFS}
1417     fi
1418 
1419     unique_lines _den_pc _den_pc
1420     edit_exact parent_child _den_pc
1421     if [ ${#_den_pc[@]} -gt 0 ]
1422     then
1423         IFS=${NO_WSP}
1424         parent_child=( ${parent_child[@]} ${_den_pc[@]} )
1425         IFS=${WSP_IFS}
1426     fi
1427 
1428     # Update list known_pair (Address and Name).
1429     unique_lines _den_pair _den_pair
1430     edit_exact known_pair _den_pair
1431     if [ ${#_den_pair[@]} -gt 0 ]  # Anything new?
1432     then
1433         IFS=${NO_WSP}
1434         known_pair=( ${known_pair[@]} ${_den_pair[@]} )
1435         IFS=${WSP_IFS}
1436     fi
1437 
1438     # Update list of reverse pairs.
1439     unique_lines _den_rev _den_rev
1440     edit_exact reverse_pair _den_rev
1441     if [ ${#_den_rev[@]} -gt 0 ]   # Anything new?
1442     then
1443         IFS=${NO_WSP}
1444         reverse_pair=( ${reverse_pair[@]} ${_den_rev[@]} )
1445         IFS=${WSP_IFS}
1446     fi
1447 
1448     # Check indirection limit -- give up if reached.
1449     if ! _den_lmt=$(limit_chk ${1})
1450     then
1451         return 0
1452     fi
1453 
1454     # Execution engine is LIFO. Order of pend operations is important.
1455     # Did we define any new addresses?
1456     unique_lines _den_address _den_address    # Scrub duplicates.
1457     edit_exact known_address _den_address     # Scrub already processed.
1458     edit_exact un_address _den_address        # Scrub already waiting.
1459     if [ ${#_den_address[@]} -gt 0 ]          # Anything new?
1460     then
1461         uc_address=( ${uc_address[@]} ${_den_address[@]} )
1462         pend_func expand_input_address ${_den_lmt}
1463         _trace_log[${#_trace_log[@]}]='# # # Added '${#_den_address[@]}' unchecked address(s). # # #'
1464     fi
1465 
1466     # Did we find any new names?
1467     unique_lines _den_name _den_name          # Scrub duplicates.
1468     edit_exact known_name _den_name           # Scrub already processed.
1469     edit_exact uc_name _den_name              # Scrub already waiting.
1470     if [ ${#_den_name[@]} -gt 0 ]             # Anything new?
1471     then
1472         uc_name=( ${uc_name[@]} ${_den_name[@]} )
1473         pend_func expand_input_name ${_den_lmt}
1474         _trace_log[${#_trace_log[@]}]='# # # Added '${#_den_name[@]}' unchecked name(s). # # #'
1475     fi
1476     return 0
1477 }
1478 
1479 # The parse-it-yourself delegation reply
1480 # Input is the chk_address list.
1481 # detail_each_address <indirection_limit>
1482 detail_each_address() {
1483     [ ${#chk_address[@]} -gt 0 ] || return 0
1484     unique_lines chk_address chk_address
1485     edit_exact known_address chk_address
1486     if [ ${#chk_address[@]} -gt 0 ]
1487     then
1488         known_address=( ${known_address[@]} ${chk_address[@]} )
1489         unset chk_address[@]
1490     fi
1491     return 0
1492 }
1493 
1494 # # # Application specific output functions # # #
1495 
1496 # Pretty print the known pairs.
1497 report_pairs() {
1498     echo
1499     echo 'Known network pairs.'
1500     col_print known_pair 2 5 30
1501 
1502     if [ ${#auth_chain[@]} -gt 0 ]
1503     then
1504         echo
1505         echo 'Known chain of authority.'
1506         col_print auth_chain 2 5 30 55
1507     fi
1508 
1509     if [ ${#reverse_pair[@]} -gt 0 ]
1510     then
1511         echo
1512         echo 'Known reverse pairs.'
1513         col_print reverse_pair 2 5 55
1514     fi
1515     return 0
1516 }
1517 
1518 # Check an address against the list of blacklist servers.
1519 # A good place to capture for GraphViz: address->status(server(reports))
1520 # check_lists <ip_address>
1521 check_lists() {
1522     [ $# -eq 1 ] || return 1
1523     local -a _cl_fwd_addr
1524     local -a _cl_rev_addr
1525     local -a _cl_reply
1526     local -i _cl_rc
1527     local -i _ls_cnt
1528     local _cl_dns_addr
1529     local _cl_lkup
1530 
1531     split_ip ${1} _cl_fwd_addr _cl_rev_addr
1532     _cl_dns_addr=$(dot_array _cl_rev_addr)'.'
1533     _ls_cnt=${#list_server[@]}
1534     echo '    Checking address '${1}
1535     for (( _cl = 0 ; _cl < _ls_cnt ; _cl++ ))
1536     do
1537         _cl_lkup=${_cl_dns_addr}${list_server[${_cl}]}
1538         if short_text ${_cl_lkup} _cl_reply
1539         then
1540             if [ ${#_cl_reply[@]} -gt 0 ]
1541             then
1542                 echo '        Records from '${list_server[${_cl}]}
1543                 address_hits[${#address_hits[@]}]=${1}' '${list_server[${_cl}]}
1544                 _hs_RC=2
1545                 for (( _clr = 0 ; _clr < ${#_cl_reply[@]} ; _clr++ ))
1546                 do
1547                     echo '            '${_cl_reply[${_clr}]}
1548                 done
1549             fi
1550         fi
1551     done
1552     return 0
1553 }
1554 
1555 # # # The usual application glue # # #
1556 
1557 # Who did it?
1558 credits() {
1559    echo
1560    echo 'Advanced Bash Scripting Guide: is_spammer.bash, v2, 2004-msz'
1561 }
1562 
1563 # How to use it?
1564 # (See also, "Quickstart" at end of script.)
1565 usage() {
1566     cat <<-'_usage_statement_'
1567     The script is_spammer.bash requires either one or two arguments.
1568 
1569     arg 1) May be one of:
1570         a) A domain name
1571         b) An IPv4 address
1572         c) The name of a file with any mix of names
1573            and addresses, one per line.
1574 
1575     arg 2) May be one of:
1576         a) A Blacklist server domain name
1577         b) The name of a file with Blacklist server
1578            domain names, one per line.
1579         c) If not present, a default list of (free)
1580            Blacklist servers is used.
1581         d) If a filename of an empty, readable, file
1582            is given,
1583            Blacklist server lookup is disabled.
1584 
1585     All script output is written to stdout.
1586 
1587     Return codes: 0 -> All OK, 1 -> Script failure,
1588                   2 -> Something is Blacklisted.
1589 
1590     Requires the external program 'dig' from the 'bind-9'
1591     set of DNS programs.  See: http://www.isc.org
1592 
1593     The domain name lookup depth limit defaults to 2 levels.
1594     Set the environment variable SPAMMER_LIMIT to change.
1595     SPAMMER_LIMIT=0 means 'unlimited'
1596 
1597     Limit may also be set on the command line.
1598     If arg#1 is an integer, the limit is set to that value
1599     and then the above argument rules are applied.
1600 
1601     Setting the environment variable 'SPAMMER_DATA' to a filename
1602     will cause the script to write a GraphViz graphic file.
1603 
1604     For the development version;
1605     Setting the environment variable 'SPAMMER_TRACE' to a filename
1606     will cause the execution engine to log a function call trace.
1607 
1608 _usage_statement_
1609 }
1610 
1611 # The default list of Blacklist servers:
1612 # Many choices, see: http://www.spews.org/lists.html
1613 
1614 declare -a default_servers
1615 # See: http://www.spamhaus.org (Conservative, well maintained)
1616 default_servers[0]='sbl-xbl.spamhaus.org'
1617 # See: http://ordb.org (Open mail relays)
1618 default_servers[1]='relays.ordb.org'
1619 # See: http://www.spamcop.net/ (You can report spammers here)
1620 default_servers[2]='bl.spamcop.net'
1621 # See: http://www.spews.org (An 'early detect' system)
1622 default_servers[3]='l2.spews.dnsbl.sorbs.net'
1623 # See: http://www.dnsbl.us.sorbs.net/using.shtml
1624 default_servers[4]='dnsbl.sorbs.net'
1625 # See: http://dsbl.org/usage (Various mail relay lists)
1626 default_servers[5]='list.dsbl.org'
1627 default_servers[6]='multihop.dsbl.org'
1628 default_servers[7]='unconfirmed.dsbl.org'
1629 
1630 # User input argument #1
1631 setup_input() {
1632     if [ -e ${1} ] && [ -r ${1} ]  # Name of readable file
1633     then
1634         file_to_array ${1} uc_name
1635         echo 'Using filename >'${1}'< as input.'
1636     else
1637         if is_address ${1}          # IP address?
1638         then
1639             uc_address=( ${1} )
1640             echo 'Starting with address >'${1}'<'
1641         else                       # Must be a name.
1642             uc_name=( ${1} )
1643             echo 'Starting with domain name >'${1}'<'
1644         fi
1645     fi
1646     return 0
1647 }
1648 
1649 # User input argument #2
1650 setup_servers() {
1651     if [ -e ${1} ] && [ -r ${1} ]  # Name of a readable file
1652     then
1653         file_to_array ${1} list_server
1654         echo 'Using filename >'${1}'< as blacklist server list.'
1655     else
1656         list_server=( ${1} )
1657         echo 'Using blacklist server >'${1}'<'
1658     fi
1659     return 0
1660 }
1661 
1662 # User environment variable SPAMMER_TRACE
1663 live_log_die() {
1664     if [ ${SPAMMER_TRACE:=} ]    # Wants trace log?
1665     then
1666         if [ ! -e ${SPAMMER_TRACE} ]
1667         then
1668             if ! touch ${SPAMMER_TRACE} 2>/dev/null
1669             then
1670                 pend_func echo $(printf '%q\n' \
1671                 'Unable to create log file >'${SPAMMER_TRACE}'<')
1672                 pend_release
1673                 exit 1
1674             fi
1675             _log_file=${SPAMMER_TRACE}
1676             _pend_hook_=trace_logger
1677             _log_dump=dump_log
1678         else
1679             if [ ! -w ${SPAMMER_TRACE} ]
1680             then
1681                 pend_func echo $(printf '%q\n' \
1682                 'Unable to write log file >'${SPAMMER_TRACE}'<')
1683                 pend_release
1684                 exit 1
1685             fi
1686             _log_file=${SPAMMER_TRACE}
1687             echo '' > ${_log_file}
1688             _pend_hook_=trace_logger
1689             _log_dump=dump_log
1690         fi
1691     fi
1692     return 0
1693 }
1694 
1695 # User environment variable SPAMMER_DATA
1696 data_capture() {
1697     if [ ${SPAMMER_DATA:=} ]    # Wants a data dump?
1698     then
1699         if [ ! -e ${SPAMMER_DATA} ]
1700        then
1701            if ! touch ${SPAMMER_DATA} 2>/dev/null
1702            then
1703                pend_func echo $(printf '%q]n' \
1704                'Unable to create data output file >'${SPAMMER_DATA}'<')
1705                pend_release
1706                exit 1
1707            fi
1708            _dot_file=${SPAMMER_DATA}
1709            _dot_dump=dump_dot
1710        else
1711            if [ ! -w ${SPAMMER_DATA} ]
1712            then
1713                pend_func echo $(printf '%q\n' \
1714                'Unable to write data output file >'${SPAMMER_DATA}'<')
1715                pend_release
1716                exit 1
1717            fi
1718            _dot_file=${SPAMMER_DATA}
1719            _dot_dump=dump_dot
1720        fi
1721    fi
1722    return 0
1723 
1724 
1725  Grope user specified arguments.
1726 o_user_args() {
1727    if [ $# -gt 0 ] && is_number $1
1728    then
1729        indirect=$1
1730        shift
1731    fi
1732 
1733    case $# in                     # Did user treat us well?
1734        1)
1735            if ! setup_input $1    # Needs error checking.
1736            then
1737                pend_release
1738                $_log_dump
1739                exit 1
1740            fi
1741            list_server=( ${default_servers[@]} )
1742            _list_cnt=${#list_server[@]}
1743            echo 'Using default blacklist server list.'
1744            echo 'Search depth limit: '${indirect}
1745            ;;
1746        2)
1747            if ! setup_input $1    # Needs error checking.
1748            then
1749                pend_release
1750                $_log_dump
1751                exit 1
1752            fi
1753            if ! setup_servers $2  # Needs error checking.
1754            then
1755                pend_release
1756                $_log_dump
1757                exit 1
1758            fi
1759            echo 'Search depth limit: '${indirect}
1760            ;;
1761        *)
1762            pend_func usage
1763            pend_release
1764            $_log_dump
1765            exit 1
1766            ;;
1767    esac
1768    return 0
1769 
1770 
1771  A general purpose debug tool.
1772  list_array <array_name>
1773 ist_array() {
1774    [ $# -eq 1 ] || return 1  # One argument required.
1775 
1776    local -a _la_lines
1777    set -f
1778    local IFS=${NO_WSP}
1779    eval _la_lines=\(\ \$\{$1\[@\]\}\ \)
1780    echo
1781    echo "Element count "${#_la_lines[@]}" array "${1}
1782    local _ln_cnt=${#_la_lines[@]}
1783 
1784    for (( _i = 0; _i < ${_ln_cnt}; _i++ ))
1785    do
1786        echo 'Element '$_i' >'${_la_lines[$_i]}'<'
1787    done
1788    set +f
1789    return 0
1790 
1791 
1792  # # 'Hunt the Spammer' program code # # #
1793 end_init                               # Ready stack engine.
1794 end_func credits                       # Last thing to print.
1795 
1796  # # Deal with user # # #
1797 ive_log_die                            # Setup debug trace log.
1798 ata_capture                            # Setup data capture file.
1799 cho
1800 do_user_args $@
1801 
1802 # # # Haven't exited yet - There is some hope # # #
1803 # Discovery group - Execution engine is LIFO - pend
1804 # in reverse order of execution.
1805 _hs_RC=0                                # Hunt the Spammer return code
1806 pend_mark
1807     pend_func report_pairs              # Report name-address pairs.
1808 
1809     # The two detail_* are mutually recursive functions.
1810     # They also pend expand_* functions as required.
1811     # These two (the last of ???) exit the recursion.
1812     pend_func detail_each_address       # Get all resources of addresses.
1813     pend_func detail_each_name          # Get all resources of names.
1814 
1815     #  The two expand_* are mutually recursive functions,
1816     #+ which pend additional detail_* functions as required.
1817     pend_func expand_input_address 1    # Expand input names by address.
1818     pend_func expand_input_name 1       # #xpand input addresses by name.
1819 
1820     # Start with a unique set of names and addresses.
1821     pend_func unique_lines uc_address uc_address
1822     pend_func unique_lines uc_name uc_name
1823 
1824     # Separate mixed input of names and addresses.
1825     pend_func split_input
1826 pend_release
1827 
1828 # # # Pairs reported -- Unique list of IP addresses found
1829 echo
1830 _ip_cnt=${#known_address[@]}
1831 if [ ${#list_server[@]} -eq 0 ]
1832 then
1833     echo 'Blacklist server list empty, none checked.'
1834 else
1835     if [ ${_ip_cnt} -eq 0 ]
1836     then
1837         echo 'Known address list empty, none checked.'
1838     else
1839         _ip_cnt=${_ip_cnt}-1   # Start at top.
1840         echo 'Checking Blacklist servers.'
1841         for (( _ip = _ip_cnt ; _ip >= 0 ; _ip-- ))
1842         do
1843             pend_func check_lists $( printf '%q\n' ${known_address[$_ip]} )
1844         done
1845     fi
1846 fi
1847 pend_release
1848 $_dot_dump                   # Graphics file dump
1849 $_log_dump                   # Execution trace
1850 echo
1851 
1852 
1853 ##############################
1854 # Example output from script #
1855 ##############################
1856 :<<-'_is_spammer_outputs_'
1857 
1858 ./is_spammer.bash 0 web4.alojamentos7.com
1859 
1860 Starting with domain name >web4.alojamentos7.com<
1861 Using default blacklist server list.
1862 Search depth limit: 0
1863 .:....::::...:::...:::.......::..::...:::.......::
1864 Known network pairs.
1865     66.98.208.97             web4.alojamentos7.com.
1866     66.98.208.97             ns1.alojamentos7.com.
1867     69.56.202.147            ns2.alojamentos.ws.
1868     66.98.208.97             alojamentos7.com.
1869     66.98.208.97             web.alojamentos7.com.
1870     69.56.202.146            ns1.alojamentos.ws.
1871     69.56.202.146            alojamentos.ws.
1872     66.235.180.113           ns1.alojamentos.org.
1873     66.235.181.192           ns2.alojamentos.org.
1874     66.235.180.113           alojamentos.org.
1875     66.235.180.113           web6.alojamentos.org.
1876     216.234.234.30           ns1.theplanet.com.
1877     12.96.160.115            ns2.theplanet.com.
1878     216.185.111.52           mail1.theplanet.com.
1879     69.56.141.4              spooling.theplanet.com.
1880     216.185.111.40           theplanet.com.
1881     216.185.111.40           www.theplanet.com.
1882     216.185.111.52           mail.theplanet.com.
1883 
1884 Checking Blacklist servers.
1885     Checking address 66.98.208.97
1886         Records from dnsbl.sorbs.net
1887             "Spam Received See: http://www.dnsbl.sorbs.net/lookup.shtml?66.98.208.97"
1888     Checking address 69.56.202.147
1889     Checking address 69.56.202.146
1890     Checking address 66.235.180.113
1891     Checking address 66.235.181.192
1892     Checking address 216.185.111.40
1893     Checking address 216.234.234.30
1894     Checking address 12.96.160.115
1895     Checking address 216.185.111.52
1896     Checking address 69.56.141.4
1897 
1898 Advanced Bash Scripting Guide: is_spammer.bash, v2, 2004-msz
1899 
1900 _is_spammer_outputs_
1901 
1902 exit ${_hs_RC}
1903 
1904 ####################################################
1905 #  The script ignores everything from here on down #
1906 #+ because of the 'exit' command, just above.      #
1907 ####################################################
1908 
1909 
1910 
1911 Quickstart
1912 ==========
1913 
1914  Prerequisites
1915 
1916   Bash version 2.05b or 3.00 (bash --version)
1917   A version of Bash which supports arrays. Array 
1918   support is included by default Bash configurations.
1919 
1920   'dig,' version 9.x.x (dig $HOSTNAME, see first line of output)
1921   A version of dig which supports the +short options. 
1922   See: dig_wrappers.bash for details.
1923 
1924 
1925  Optional Prerequisites
1926 
1927   'named,' a local DNS caching program. Any flavor will do.
1928   Do twice: dig $HOSTNAME 
1929   Check near bottom of output for: SERVER: 127.0.0.1#53
1930   That means you have one running.
1931 
1932 
1933  Optional Graphics Support
1934 
1935   'date,' a standard *nix thing. (date -R)
1936 
1937   dot Program to convert graphic description file to a 
1938   diagram. (dot -V)
1939   A part of the Graph-Viz set of programs.
1940   See: [http://www.research.att.com/sw/tools/graphviz||GraphViz]
1941 
1942   'dotty,' a visual editor for graphic description files.
1943   Also a part of the Graph-Viz set of programs.
1944 
1945 
1946 
1947 
1948  Quick Start
1949 
1950 In the same directory as the is_spammer.bash script; 
1951 Do: ./is_spammer.bash
1952 
1953  Usage Details
1954 
1955 1\. Blacklist server choices.
1956 
1957   (a) To use default, built-in list: Do nothing.
1958 
1959   (b) To use your own list: 
1960 
1961     i. Create a file with a single Blacklist server 
1962        domain name per line.
1963 
1964     ii. Provide that filename as the last argument to 
1965         the script.
1966 
1967   (c) To use a single Blacklist server: Last argument 
1968       to the script.
1969 
1970   (d) To disable Blacklist lookups:
1971 
1972     i. Create an empty file (touch spammer.nul)
1973        Your choice of filename.
1974 
1975     ii. Provide the filename of that empty file as the 
1976         last argument to the script.
1977 
1978 2\. Search depth limit.
1979 
1980   (a) To use the default value of 2: Do nothing.
1981 
1982   (b) To set a different limit: 
1983       A limit of 0 means: no limit.
1984 
1985     i. export SPAMMER_LIMIT=1
1986        or whatever limit you want.
1987 
1988     ii. OR provide the desired limit as the first 
1989        argument to the script.
1990 
1991 3\. Optional execution trace log.
1992 
1993   (a) To use the default setting of no log output: Do nothing.
1994 
1995   (b) To write an execution trace log:
1996       export SPAMMER_TRACE=spammer.log
1997       or whatever filename you want.
1998 
1999 4\. Optional graphic description file.
2000 
2001   (a) To use the default setting of no graphic file: Do nothing.
2002 
2003   (b) To write a Graph-Viz graphic description file:
2004       export SPAMMER_DATA=spammer.dot
2005       or whatever filename you want.
2006 
2007 5\. Where to start the search.
2008 
2009   (a) Starting with a single domain name:
2010 
2011     i. Without a command line search limit: First 
2012        argument to script.
2013 
2014     ii. With a command line search limit: Second 
2015         argument to script.
2016 
2017   (b) Starting with a single IP address:
2018 
2019     i. Without a command line search limit: First 
2020        argument to script.
2021 
2022     ii. With a command line search limit: Second 
2023         argument to script.
2024 
2025   (c) Starting with (mixed) multiple name(s) and/or address(es):
2026       Create a file with one name or address per line.
2027       Your choice of filename.
2028 
2029     i. Without a command line search limit: Filename as 
2030        first argument to script.
2031 
2032     ii. With a command line search limit: Filename as 
2033         second argument to script.
2034 
2035 6\. What to do with the display output.
2036 
2037   (a) To view display output on screen: Do nothing.
2038 
2039   (b) To save display output to a file: Redirect stdout to a filename.
2040 
2041   (c) To discard display output: Redirect stdout to /dev/null.
2042 
2043 7\. Temporary end of decision making. 
2044    press RETURN 
2045    wait (optionally, watch the dots and colons).
2046 
2047 8\. Optionally check the return code.
2048 
2049   (a) Return code 0: All OK
2050 
2051   (b) Return code 1: Script setup failure
2052 
2053   (c) Return code 2: Something was blacklisted.
2054 
2055 9\. Where is my graph (diagram)?
2056 
2057 The script does not directly produce a graph (diagram). 
2058 It only produces a graphic description file. You can 
2059 process the graphic descriptor file that was output 
2060 with the 'dot' program.
2061 
2062 Until you edit that descriptor file, to describe the 
2063 relationships you want shown, all that you will get is 
2064 a bunch of labeled name and address nodes.
2065 
2066 All of the script's discovered relationships are within 
2067 a comment block in the graphic descriptor file, each 
2068 with a descriptive heading.
2069 
2070 The editing required to draw a line between a pair of 
2071 nodes from the information in the descriptor file may 
2072 be done with a text editor. 
2073 
2074 Given these lines somewhere in the descriptor file:
2075 
2076 # Known domain name nodes
2077 
2078 N0000 [label="guardproof.info."] ;
2079 
2080 N0002 [label="third.guardproof.info."] ;
2081 
2082 
2083 
2084 # Known address nodes
2085 
2086 A0000 [label="61.141.32.197"] ;
2087 
2088 
2089 
2090 /*
2091 
2092 # Known name->address edges
2093 
2094 NA0000 third.guardproof.info. 61.141.32.197
2095 
2096 
2097 
2098 # Known parent->child edges
2099 
2100 PC0000 guardproof.info. third.guardproof.info.
2101 
2102  */
2103 
2104 Turn that into the following lines by substituting node 
2105 identifiers into the relationships:
2106 
2107 # Known domain name nodes
2108 
2109 N0000 [label="guardproof.info."] ;
2110 
2111 N0002 [label="third.guardproof.info."] ;
2112 
2113 
2114 
2115 # Known address nodes
2116 
2117 A0000 [label="61.141.32.197"] ;
2118 
2119 
2120 
2121 # PC0000 guardproof.info. third.guardproof.info.
2122 
2123 N0000->N0002 ;
2124 
2125 
2126 
2127 # NA0000 third.guardproof.info. 61.141.32.197
2128 
2129 N0002->A0000 ;
2130 
2131 
2132 
2133 /*
2134 
2135 # Known name->address edges
2136 
2137 NA0000 third.guardproof.info. 61.141.32.197
2138 
2139 
2140 
2141 # Known parent->child edges
2142 
2143 PC0000 guardproof.info. third.guardproof.info.
2144 
2145  */
2146 
2147 Process that with the 'dot' program, and you have your 
2148 first network diagram.
2149 
2150 In addition to the conventional graphic edges, the 
2151 descriptor file includes similar format pair-data that 
2152 describes services, zone records (sub-graphs?), 
2153 blacklisted addresses, and other things which might be 
2154 interesting to include in your graph. This additional 
2155 information could be displayed as different node 
2156 shapes, colors, line sizes, etc.
2157 
2158 The descriptor file can also be read and edited by a 
2159 Bash script (of course). You should be able to find 
2160 most of the functions required within the 
2161 "is_spammer.bash" script.
2162 
2163 # End Quickstart.
2164 
2165 
2166 
2167 Additional Note
2168 ========== ====
2169 
2170 Michael Zick points out that there is a "makeviz.bash" interactive
2171 Web site at rediris.es. Can't give the full URL, since this is not
2172 a publically accessible site.</pre>

 |

* * *

另一个阻挡垃圾邮件的脚本.

* * *

**例子 A-29\. 垃圾邮件服务器猎手**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # whx.sh: "whois" spammer lookup
  3 # Author: Walter Dnes
  4 # Slight revisions (first section) by ABS Guide author.
  5 # Used in ABS Guide with permission.
  6 
  7 # Needs version 3.x or greater of Bash to run (because of =~ operator).
  8 # Commented by script author and ABS Guide author.
  9 
 10 
 11 
 12 E_BADARGS=65        # Missing command-line arg.
 13 E_NOHOST=66         # Host not found.
 14 E_TIMEOUT=67        # Host lookup timed out.
 15 E_UNDEF=68          # Some other (undefined) error.
 16 HOSTWAIT=10         # Specify up to 10 seconds for host query reply.
 17                     # The actual wait may be a bit longer.
 18 OUTFILE=whois.txt   # Output file.
 19 PORT=4321
 20 
 21 
 22 if [ -z "$1" ]      # Check for (required) command-line arg.
 23 then
 24   echo "Usage: $0 domain name or IP address"
 25   exit $E_BADARGS
 26 fi
 27 
 28 
 29 if [[ "$1" =~ "[a-zA-Z][a-zA-Z]$" ]]  # Ends in two alpha chars?
 30 then                                  # It's a domain name && must do host lookup.
 31   IPADDR=$(host -W $HOSTWAIT $1 | awk '{print $4}')
 32                                       # Doing host lookup to get IP address.
 33 				      # Extract final field.
 34 else
 35   IPADDR="$1"                         # Command-line arg was IP address.
 36 fi
 37 
 38 echo; echo "IP Address is: "$IPADDR""; echo
 39 
 40 if [ -e "$OUTFILE" ]
 41 then
 42   rm -f "$OUTFILE"
 43   echo "Stale output file \"$OUTFILE\" removed."; echo
 44 fi
 45 
 46 
 47 #  Sanity checks.
 48 #  (This section needs more work.)
 49 #  ===============================
 50 if [ -z "$IPADDR" ]
 51 # No response.
 52 then
 53   echo "Host not found!"
 54   exit $E_NOHOST    # Bail out.
 55 fi
 56 
 57 if [[ "$IPADDR" =~ "^[;;]" ]]
 58 #  ;; connection timed out; no servers could be reached
 59 then
 60   echo "Host lookup timed out!"
 61   exit $E_TIMEOUT   # Bail out.
 62 fi
 63 
 64 if [[ "$IPADDR" =~ "[(NXDOMAIN)]$" ]]
 65 #  Host xxxxxxxxx.xxx not found: 3(NXDOMAIN)
 66 then
 67   echo "Host not found!"
 68   exit $E_NOHOST    # Bail out.
 69 fi
 70 
 71 if [[ "$IPADDR" =~ "[(SERVFAIL)]$" ]]
 72 #  Host xxxxxxxxx.xxx not found: 2(SERVFAIL)
 73 then
 74   echo "Host not found!"
 75   exit $E_NOHOST    # Bail out.
 76 fi
 77 
 78 
 79 
 80 
 81 # ======================== Main body of script ========================
 82 
 83 AFRINICquery() {
 84 #  Define the function that queries AFRINIC. Echo a notification to the
 85 #+ screen, and then run the actual query, redirecting output to $OUTFILE.
 86 
 87   echo "Searching for $IPADDR in whois.afrinic.net"
 88   whois -h whois.afrinic.net "$IPADDR" > $OUTFILE
 89 
 90 #  Check for presence of reference to an rwhois.
 91 #  Warn about non-functional rwhois.infosat.net server
 92 #+ and attempt rwhois query.
 93   if grep -e "^remarks: .*rwhois\.[^ ]\+" "$OUTFILE"
 94   then
 95     echo " " >> $OUTFILE
 96     echo "***" >> $OUTFILE
 97     echo "***" >> $OUTFILE
 98     echo "Warning: rwhois.infosat.net was not working as of 2005/02/02" >> $OUTFILE
 99     echo "         when this script was written." >> $OUTFILE
100     echo "***" >> $OUTFILE
101     echo "***" >> $OUTFILE
102     echo " " >> $OUTFILE
103     RWHOIS=`grep "^remarks: .*rwhois\.[^ ]\+" "$OUTFILE" | tail -n 1 |\
104     sed "s/\(^.*\)\(rwhois\..*\)\(:4.*\)/\2/"`
105     whois -h ${RWHOIS}:${PORT} "$IPADDR" >> $OUTFILE
106   fi
107 }
108 
109 APNICquery() {
110   echo "Searching for $IPADDR in whois.apnic.net"
111   whois -h whois.apnic.net "$IPADDR" > $OUTFILE
112 
113 #  Just  about  every  country has its own internet registrar.
114 #  I don't normally bother consulting them, because the regional registry
115 #+ usually supplies sufficient information.
116 #  There are a few exceptions, where the regional registry simply
117 #+ refers to the national registry for direct data.
118 #  These are Japan and South Korea in APNIC, and Brasil in LACNIC.
119 #  The following if statement checks $OUTFILE (whois.txt) for the presence
120 #+ of "KR" (South Korea) or "JP" (Japan) in the country field.
121 #  If either is found, the query is re-run against the appropriate
122 #+ national registry.
123 
124   if grep -E "^country:[ ]+KR$" "$OUTFILE"
125   then
126     echo "Searching for $IPADDR in whois.krnic.net"
127     whois -h whois.krnic.net "$IPADDR" >> $OUTFILE
128   elif grep -E "^country:[ ]+JP$" "$OUTFILE"
129   then
130     echo "Searching for $IPADDR in whois.nic.ad.jp"
131     whois -h whois.nic.ad.jp "$IPADDR"/e >> $OUTFILE
132   fi
133 }
134 
135 ARINquery() {
136   echo "Searching for $IPADDR in whois.arin.net"
137   whois -h whois.arin.net "$IPADDR" > $OUTFILE
138 
139 #  Several large internet providers listed by ARIN have their own
140 #+ internal whois service, referred to as "rwhois".
141 #  A large block of IP addresses is listed with the provider
142 #+ under the ARIN registry.
143 #  To get the IP addresses of 2nd-level ISPs or other large customers,
144 #+ one has to refer to the rwhois server on port 4321.
145 #  I originally started with a bunch of "if" statements checking for
146 #+ the larger providers.
147 #  This approach is unwieldy, and there's always another rwhois server
148 #+ that I didn't know about.
149 #  A more elegant approach is to check $OUTFILE for a reference
150 #+ to a whois server, parse that server name out of the comment section,
151 #+ and re-run the query against the appropriate rwhois server.
152 #  The parsing looks a bit ugly, with a long continued line inside
153 #+ backticks.
154 #  But it only has to be done once, and will work as new servers are added.
155 #@   ABS Guide author comment: it isn't all that ugly, and is, in fact,
156 #@+  an instructive use of Regular Expressions.
157 
158   if grep -E "^Comment: .*rwhois.[^ ]+" "$OUTFILE"
159   then
160     RWHOIS=`grep -e "^Comment:.*rwhois\.[^ ]\+" "$OUTFILE" | tail -n 1 |\
161     sed "s/^\(.*\)\(rwhois\.[^ ]\+\)\(.*$\)/\2/"`
162     echo "Searching for $IPADDR in ${RWHOIS}"
163     whois -h ${RWHOIS}:${PORT} "$IPADDR" >> $OUTFILE
164   fi
165 }
166 
167 LACNICquery() {
168   echo "Searching for $IPADDR in whois.lacnic.net"
169   whois -h whois.lacnic.net "$IPADDR" > $OUTFILE
170 
171 #  The  following if statement checks $OUTFILE (whois.txt) for the presence of
172 #+ "BR" (Brasil) in the country field.
173 #  If it is found, the query is re-run against whois.registro.br.
174 
175   if grep -E "^country:[ ]+BR$" "$OUTFILE"
176   then
177     echo "Searching for $IPADDR in whois.registro.br"
178     whois -h whois.registro.br "$IPADDR" >> $OUTFILE
179   fi
180 }
181 
182 RIPEquery() {
183   echo "Searching for $IPADDR in whois.ripe.net"
184   whois -h whois.ripe.net "$IPADDR" > $OUTFILE
185 }
186 
187 #  Initialize a few variables.
188 #  * slash8 is the most significant octet
189 #  * slash16 consists of the two most significant octets
190 #  * octet2 is the second most significant octet
191 
192 
193 
194 
195 slash8=`echo $IPADDR | cut -d. -f 1`
196   if [ -z "$slash8" ]  # Yet another sanity check.
197   then
198     echo "Undefined error!"
199     exit $E_UNDEF
200   fi
201 slash16=`echo $IPADDR | cut -d. -f 1-2`
202 #                             ^ Period specified as 'cut" delimiter.
203   if [ -z "$slash16" ]
204   then
205     echo "Undefined error!"
206     exit $E_UNDEF
207   fi
208 octet2=`echo $slash16 | cut -d. -f 2`
209   if [ -z "$octet2" ]
210   then
211     echo "Undefined error!"
212     exit $E_UNDEF
213   fi
214 
215 
216 #  Check for various odds and ends of reserved space.
217 #  There is no point in querying for those addresses.
218 
219 if [ $slash8 == 0 ]; then
220   echo $IPADDR is '"This Network"' space\; Not querying
221 elif [ $slash8 == 10 ]; then
222   echo $IPADDR is RFC1918 space\; Not querying
223 elif [ $slash8 == 14 ]; then
224   echo $IPADDR is '"Public Data Network"' space\; Not querying
225 elif [ $slash8 == 127 ]; then
226   echo $IPADDR is loopback space\; Not querying
227 elif [ $slash16 == 169.254 ]; then
228   echo $IPADDR is link-local space\; Not querying
229 elif [ $slash8 == 172 ] && [ $octet2 -ge 16 ] && [ $octet2 -le 31 ];then
230   echo $IPADDR is RFC1918 space\; Not querying
231 elif [ $slash16 == 192.168 ]; then
232   echo $IPADDR is RFC1918 space\; Not querying
233 elif [ $slash8 -ge 224 ]; then
234   echo $IPADDR is either Multicast or reserved space\; Not querying
235 elif [ $slash8 -ge 200 ] && [ $slash8 -le 201 ]; then LACNICquery "$IPADDR"
236 elif [ $slash8 -ge 202 ] && [ $slash8 -le 203 ]; then APNICquery "$IPADDR"
237 elif [ $slash8 -ge 210 ] && [ $slash8 -le 211 ]; then APNICquery "$IPADDR"
238 elif [ $slash8 -ge 218 ] && [ $slash8 -le 223 ]; then APNICquery "$IPADDR"
239 
240 #  If we got this far without making a decision, query ARIN.
241 #  If a reference is found in $OUTFILE to APNIC, AFRINIC, LACNIC, or RIPE,
242 #+ query the appropriate whois server.
243 
244 else
245   ARINquery "$IPADDR"
246   if grep "whois.afrinic.net" "$OUTFILE"; then
247     AFRINICquery "$IPADDR"
248   elif grep -E "^OrgID:[ ]+RIPE$" "$OUTFILE"; then
249     RIPEquery "$IPADDR"
250   elif grep -E "^OrgID:[ ]+APNIC$" "$OUTFILE"; then
251     APNICquery "$IPADDR"
252   elif grep -E "^OrgID:[ ]+LACNIC$" "$OUTFILE"; then
253     LACNICquery "$IPADDR"
254   fi
255 fi
256 
257 #@  ---------------------------------------------------------------
258 #   Try also:
259 #   wget http://logi.cc/nw/whois.php3?ACTION=doQuery&DOMAIN=$IPADDR
260 #@  ---------------------------------------------------------------
261 
262 #  We've  now  finished  the querying.
263 #  Echo a copy of the final result to the screen.
264 
265 cat $OUTFILE
266 # Or "less $OUTFILE" . . .
267 
268 
269 exit 0
270 
271 #@  ABS Guide author comments:
272 #@  Nothing fancy here, but still a very useful tool for hunting spammers.
273 #@  Sure, the script can be cleaned up some, and it's still a bit buggy,
274 #@+ (exercise for reader), but all the same, it's a nice piece of coding
275 #@+ by Walter Dnes.
276 #@  Thank you!</pre>

 |

* * *

<span class="QUOTE">"Little Monster的"</span>之前的[wget](communications.md#WGETREF).

* * *

**例子 A-30\. 使得**wget**更易用**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # wgetter2.bash
  3 
  4 # Author: Little Monster [monster@monstruum.co.uk]
  5 # ==> Used in ABS Guide with permission of script author.
  6 # ==> This script still needs debugging and fixups (exercise for reader).
  7 # ==> It could also use some additional editing in the comments.
  8 
  9 
 10 #  This is wgetter2 --
 11 #+ a Bash script to make wget a bit more friendly, and save typing.
 12 
 13 #  Carefully crafted by Little Monster.
 14 #  More or less complete on 02/02/2005.
 15 #  If you think this script can be improved,
 16 #+ email me at: monster@monstruum.co.uk
 17 # ==> and cc: to the author of the ABS Guide, please.
 18 #  This script is licenced under the GPL.
 19 #  You are free to copy, alter and re-use it,
 20 #+ but please don't try to claim you wrote it.
 21 #  Log your changes here instead.
 22 
 23 # =======================================================================
 24 # changelog:
 25 
 26 # 07/02/2005\.  Fixups by Little Monster.
 27 # 02/02/2005\.  Minor additions by Little Monster.
 28 #              (See after # +++++++++++ )
 29 # 29/01/2005\.  Minor stylistic edits and cleanups by author of ABS Guide.
 30 #              Added exit error codes.
 31 # 22/11/2004\.  Finished initial version of second version of wgetter:
 32 #              wgetter2 is born.
 33 # 01/12/2004\.  Changed 'runn' function so it can be run 2 ways --
 34 #              either ask for a file name or have one input on the CL.
 35 # 01/12/2004\.  Made sensible handling of no URL's given.
 36 # 01/12/2004\.  Made loop of main options, so you don't
 37 #              have to keep calling wgetter 2 all the time.
 38 #              Runs as a session instead.
 39 # 01/12/2004\.  Added looping to 'runn' function.
 40 #              Simplified and improved.
 41 # 01/12/2004\.  Added state to recursion setting.
 42 #              Enables re-use of previous value.
 43 # 05/12/2004\.  Modified the file detection routine in the 'runn' function
 44 #              so it's not fooled by empty values, and is cleaner.
 45 # 01/02/2004\.  Added cookie finding routine from later version (which 
 46 #              isn't ready yet), so as not to have hard-coded paths.
 47 # =======================================================================
 48 
 49 # Error codes for abnormal exit.
 50 E_USAGE=67        # Usage message, then quit.
 51 E_NO_OPTS=68      # No command-line args entered.
 52 E_NO_URLS=69      # No URLs passed to script.
 53 E_NO_SAVEFILE=70  # No save filename passed to script.
 54 E_USER_EXIT=71    # User decides to quit.
 55 
 56 
 57 #  Basic default wget command we want to use.
 58 #  This is the place to change it, if required.
 59 #  NB: if using a proxy, set http_proxy = yourproxy in .wgetrc.
 60 #  Otherwise delete --proxy=on, below.
 61 # ====================================================================
 62 CommandA="wget -nc -c -t 5 --progress=bar --random-wait --proxy=on -r"
 63 # ====================================================================
 64 
 65 
 66 
 67 # --------------------------------------------------------------------
 68 # Set some other variables and explain them.
 69 
 70 pattern=" -A .jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.htm,.html,.shtml,.php"
 71                     # wget's option to only get certain types of file.
 72                     # comment out if not using
 73 today=`date +%F`    # Used for a filename.
 74 home=$HOME          # Set HOME to an internal variable.
 75                     # In case some other path is used, change it here.
 76 depthDefault=3      # Set a sensible default recursion.
 77 Depth=$depthDefault # Otherwise user feedback doesn't tie in properly.
 78 RefA=""             # Set blank referring page.
 79 Flag=""             #  Default to not saving anything,
 80                     #+ or whatever else might be wanted in future.
 81 lister=""           # Used for passing a list of urls directly to wget.
 82 Woptions=""         # Used for passing wget some options for itself.
 83 inFile=""           # Used for the run function.
 84 newFile=""          # Used for the run function.
 85 savePath="$home/w-save"
 86 Config="$home/.wgetter2rc"
 87                     #  This is where some variables can be stored, 
 88                     #+ if permanently changed from within the script.
 89 Cookie_List="$home/.cookielist"
 90                     # So we know where the cookies are kept . . .
 91 cFlag=""            # Part of the cookie file selection routine.
 92 
 93 # Define the options available. Easy to change letters here if needed.
 94 # These are the optional options; you don't just wait to be asked.
 95 
 96 save=s   # Save command instead of executing it.
 97 cook=c   # Change cookie file for this session.
 98 help=h   # Usage guide.
 99 list=l   # Pass wget the -i option and URL list.
100 runn=r   # Run saved commands as an argument to the option.
101 inpu=i   # Run saved commands interactively.
102 wopt=w   # Allow to enter options to pass directly to wget.
103 # --------------------------------------------------------------------
104 
105 
106 if [ -z "$1" ]; then   # Make sure we get something for wget to eat.
107    echo "You must at least enter a URL or option!"
108    echo "-$help for usage."
109    exit $E_NO_OPTS
110 fi
111 
112 
113 
114 # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
115 # added added added added added added added added added added added added
116 
117 if [ ! -e "$Config" ]; then   # See if configuration file exists.
118    echo "Creating configuration file, $Config"
119    echo "# This is the configuration file for wgetter2" > "$Config"
120    echo "# Your customised settings will be saved in this file" >> "$Config"
121 else
122    source $Config             # Import variables we set outside the script.
123 fi
124 
125 if [ ! -e "$Cookie_List" ]; then
126    # Set up a list of cookie files, if there isn't one.
127    echo "Hunting for cookies . . ."
128    find -name cookies.txt >> $Cookie_List   # Create the list of cookie files.
129 fi #  Isolate this in its own 'if' statement,
130    #+ in case we got interrupted while searching.
131 
132 if [ -z "$cFlag" ]; then # If we haven't already done this . . .
133    echo                  # Make a nice space after the command prompt.
134    echo "Looks like you haven't set up your source of cookies yet."
135    n=0                   # Make sure the counter doesn't contain random values.
136    while read; do
137       Cookies[$n]=$REPLY # Put the cookie files we found into an array.
138       echo "$n) ${Cookies[$n]}"  # Create a menu.
139       n=$(( n + 1 ))     # Increment the counter.
140    done < $Cookie_List   # Feed the read statement.
141    echo "Enter the number of the cookie file you want to use."
142    echo "If you won't be using cookies, just press RETURN."
143    echo
144    echo "I won't be asking this again. Edit $Config"
145    echo "If you decide to change at a later date"
146    echo "or use the -${cook} option for per session changes."
147    read
148    if [ ! -z $REPLY ]; then   # User didn't just press return.
149       Cookie=" --load-cookies ${Cookies[$REPLY]}"
150       # Set the variable here as well as in the config file.
151 
152       echo "Cookie=\" --load-cookies ${Cookies[$REPLY]}\"" >> $Config
153    fi
154    echo "cFlag=1" >> $Config  # So we know not to ask again.
155 fi
156 
157 # end added section end added section end added section end added section end
158 # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
159 
160 
161 
162 # Another variable.
163 # This one may or may not be subject to variation.
164 # A bit like the small print.
165 CookiesON=$Cookie
166 # echo "cookie file is $CookiesON" # For debugging.
167 # echo "home is ${home}"           # For debugging. Got caught with this one!
168 
169 
170 wopts()
171 {
172 echo "Enter options to pass to wget."
173 echo "It is assumed you know what you're doing."
174 echo
175 echo "You can pass their arguments here too."
176 # That is to say, everything passed here is passed to wget.
177 
178 read Wopts
179 # Read in the options to be passed to wget.
180 
181 Woptions=" $Wopts"
182 # Assign to another variable.
183 # Just for fun, or something . . .
184 
185 echo "passing options ${Wopts} to wget"
186 # Mainly for debugging.
187 # Is cute.
188 
189 return
190 }
191 
192 
193 save_func()
194 {
195 echo "Settings will be saved."
196 if [ ! -d $savePath ]; then  #  See if directory exists.
197    mkdir $savePath           #  Create the directory to save things in
198                              #+ if it isn't already there.
199 fi
200 
201 Flag=S
202 # Tell the final bit of code what to do.
203 # Set a flag since stuff is done in main.
204 
205 return
206 }
207 
208 
209 usage() # Tell them how it works.
210 {
211     echo "Welcome to wgetter.  This is a front end to wget."
212     echo "It will always run wget with these options:"
213     echo "$CommandA"
214     echo "and the pattern to match: $pattern (which you can change at the top of this script)."
215     echo "It will also ask you for recursion depth, and if you want to use a referring page."
216     echo "Wgetter accepts the following options:"
217     echo ""
218     echo "-$help : Display this help."
219     echo "-$save : Save the command to a file $savePath/wget-($today) instead of running it."
220     echo "-$runn : Run saved wget commands instead of starting a new one --"
221     echo "Enter filename as argument to this option."
222     echo "-$inpu : Run saved wget commands interactively --"
223     echo "The script will ask you for the filename."
224     echo "-$cook : Change the cookies file for this session."
225     echo "-$list : Tell wget to use URL's from a list instead of from the command line."
226     echo "-$wopt : Pass any other options direct to wget."
227     echo ""
228     echo "See the wget man page for additional options you can pass to wget."
229     echo ""
230 
231     exit $E_USAGE  # End here. Don't process anything else.
232 }
233 
234 
235 
236 list_func() #  Gives the user the option to use the -i option to wget,
237             #+ and a list of URLs.
238 {
239 while [ 1 ]; do
240    echo "Enter the name of the file containing URL's (press q to change your 
241 mind)."
242    read urlfile
243    if [ ! -e "$urlfile" ] && [ "$urlfile" != q ]; then
244        # Look for a file, or the quit option.
245        echo "That file does not exist!"
246    elif [ "$urlfile" = q ]; then # Check quit option.
247        echo "Not using a url list."
248        return
249    else
250       echo "using $urlfile."
251       echo "If you gave me url's on the command line, I'll use those first."
252                             # Report wget standard behaviour to the user.
253       lister=" -i $urlfile" # This is what we want to pass to wget.
254       return
255    fi
256 done
257 }
258 
259 
260 cookie_func() # Give the user the option to use a different cookie file.
261 {
262 while [ 1 ]; do
263    echo "Change the cookies file. Press return if you don't want to change 
264 it."
265    read Cookies
266    # NB: this is not the same as Cookie, earlier.
267    # There is an 's' on the end.
268    # Bit like chocolate chips.
269    if [ -z "$Cookies" ]; then                 # Escape clause for wusses.
270       return
271    elif [ ! -e "$Cookies" ]; then
272       echo "File does not exist.  Try again." # Keep em going . . .
273    else
274        CookiesON=" --load-cookies $Cookies"   # File is good -- let's use it!
275        return
276    fi
277 done
278 }
279 
280 
281 
282 run_func()
283 {
284 if [ -z "$OPTARG" ]; then
285 # Test to see if we used the in-line option or the query one.
286    if [ ! -d "$savePath" ]; then      # In case directory doesn't exist . . .
287       echo "$savePath does not appear to exist."
288       echo "Please supply path and filename of saved wget commands:"
289       read newFile
290          until [ -f "$newFile" ]; do  # Keep going till we get something.
291             echo "Sorry, that file does not exist.  Please try again."
292             # Try really hard to get something.
293             read newFile
294          done
295 
296 
297 # -------------------------------------------------------------------------
298 #         if [ -z ( grep wget ${newfile} ) ]; then
299           # Assume they haven't got the right file and bail out.
300 #         echo "Sorry, that file does not contain wget commands.  Aborting."
301 #         exit
302 #         fi
303 #
304 # This is bogus code.
305 # It doesn't actually work.
306 # If anyone wants to fix it, feel free!
307 # -------------------------------------------------------------------------
308 
309 
310       filePath="${newFile}"
311    else
312    echo "Save path is $savePath"
313       echo "Please enter name of the file which you want to use."
314       echo "You have a choice of:"
315       ls $savePath                                    # Give them a choice.
316       read inFile
317          until [ -f "$savePath/$inFile" ]; do         # Keep going till we get something.
318             if [ ! -f "${savePath}/${inFile}" ]; then # If file doesn't exist.
319                echo "Sorry, that file does not exist.  Please choose from:"
320                ls $savePath                           # If a mistake is made.
321                read inFile
322             fi
323          done
324       filePath="${savePath}/${inFile}"  # Make one variable . . .
325    fi
326 else filePath="${savePath}/${OPTARG}"   # Which can be many things . . .
327 fi
328 
329 if [ ! -f "$filePath" ]; then           # If a bogus file got through.
330    echo "You did not specify a suitable file."
331    echo "Run this script with the -${save} option first."
332    echo "Aborting."
333    exit $E_NO_SAVEFILE
334 fi
335 echo "Using: $filePath"
336 while read; do
337     eval $REPLY
338     echo "Completed: $REPLY"
339 done < $filePath  # Feed the actual file we are using into a 'while' loop.
340 
341 exit
342 }
343 
344 
345 
346 # Fish out any options we are using for the script.
347 # This is based on the demo in "Learning The Bash Shell" (O'Reilly).
348 while getopts ":$save$cook$help$list$runn:$inpu$wopt" opt
349 do
350   case $opt in
351      $save) save_func;;   #  Save some wgetter sessions for later.
352      $cook) cookie_func;; #  Change cookie file.
353      $help) usage;;       #  Get help.
354      $list) list_func;;   #  Allow wget to use a list of URLs.
355      $runn) run_func;;    #  Useful if you are calling wgetter from, for example,
356                           #+ a cron script.
357      $inpu) run_func;;    #  When you don't know what your files are named.
358      $wopt) wopts;;       #  Pass options directly to wget.
359         \?) echo "Not a valid option."
360             echo "Use -${wopt} if you want to pass options directly to wget,"
361             echo "or -${help} for help";;      # Catch anything else.
362   esac
363 done
364 shift $((OPTIND - 1))     # Do funky magic stuff with $#.
365 
366 
367 if [ -z "$1" ] && [ -z "$lister" ]; then
368                           #  We should be left with at least one URL
369                           #+ on the command line, unless a list is 
370 			  #+ being used -- catch empty CL's.
371    echo "No URL's given!  You must enter them on the same line as wgetter2."
372    echo "E.g.,  wgetter2 http://somesite http://anothersite."
373    echo "Use $help option for more information."
374    exit $E_NO_URLS        # Bail out, with appropriate error code.
375 fi
376 
377 URLS=" $@"
378 # Use this so that URL list can be changed if we stay in the option loop.
379 
380 while [ 1 ]; do
381    # This is where we ask for the most used options.
382    # (Mostly unchanged from version 1 of wgetter)
383    if [ -z $curDepth ]; then
384       Current=""
385    else Current=" Current value is $curDepth"
386    fi
387        echo "How deep should I go? (integer: Default is $depthDefault.$Current)"
388        read Depth   # Recursion -- how far should we go?
389        inputB=""    # Reset this to blank on each pass of the loop.
390        echo "Enter the name of the referring page (default is none)."
391        read inputB  # Need this for some sites.
392 
393        echo "Do you want to have the output logged to the terminal"
394        echo "(y/n, default is yes)?"
395        read noHide  # Otherwise wget will just log it to a file.
396 
397        case $noHide in    # Now you see me, now you don't.
398           y|Y ) hide="";;
399           n|N ) hide=" -b";;
400             * ) hide="";;
401        esac
402 
403        if [ -z ${Depth} ]; then       #  User accepted either default or current depth,
404                                       #+ in which case Depth is now empty.
405           if [ -z ${curDepth} ]; then #  See if a depth was set on a previous iteration.
406              Depth="$depthDefault"    #  Set the default recursion depth if nothing
407                                       #+ else to use.
408           else Depth="$curDepth"      #  Otherwise, set the one we used before.
409           fi
410        fi
411    Recurse=" -l $Depth"               # Set how deep we want to go.
412    curDepth=$Depth                    # Remember setting for next time.
413 
414        if [ ! -z $inputB ]; then
415           RefA=" --referer=$inputB"   # Option to use referring page.
416        fi
417 
418    WGETTER="${CommandA}${pattern}${hide}${RefA}${Recurse}${CookiesON}${lister}${Woptions}${URLS}"
419    #  Just string the whole lot together . . .
420    #  NB: no embedded spaces.
421    #  They are in the individual elements so that if any are empty,
422    #+ we don't get an extra space.
423 
424    if [ -z "${CookiesON}" ] && [ "$cFlag" = "1" ] ; then
425        echo "Warning -- can't find cookie file"
426        # This should be changed, in case the user has opted to not use cookies.
427    fi
428 
429    if [ "$Flag" = "S" ]; then
430       echo "$WGETTER" >> $savePath/wget-${today}
431       #  Create a unique filename for today, or append to it if it exists.
432       echo "$inputB" >> $savePath/site-list-${today}
433       #  Make a list, so it's easy to refer back to,
434       #+ since the whole command is a bit confusing to look at.
435       echo "Command saved to the file $savePath/wget-${today}"
436            # Tell the user.
437       echo "Referring page URL saved to the file $savePath/site-list-${today}"
438            # Tell the user.
439       Saver=" with save option"
440       # Stick this somewhere, so it appears in the loop if set.
441    else
442        echo "*****************"
443        echo "*****Getting*****"
444        echo "*****************"
445        echo ""
446        echo "$WGETTER"
447        echo ""
448        echo "*****************"
449        eval "$WGETTER"
450    fi
451 
452        echo ""
453        echo "Starting over$Saver."
454        echo "If you want to stop, press q."
455        echo "Otherwise, enter some URL's:"
456        # Let them go again. Tell about save option being set.
457 
458        read
459        case $REPLY in                # Need to change this to a 'trap' clause.
460           q|Q ) exit $E_USER_EXIT;;  # Exercise for the reader?
461             * ) URLS=" $REPLY";;
462        esac
463 
464        echo ""
465 done
466 
467 
468 exit 0</pre>

 |

* * *

* * *

**例子 A-31\. 一个<span class="QUOTE">"podcasting"</span>(译者: 指的是在互联网上发布音视频文件, 并允许用户订阅并自动接收的方法)脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # bashpodder.sh:
  4 # By Linc 10/1/2004
  5 # Find the latest script at http://linc.homeunix.org:8080/scripts/bashpodder
  6 # Last revision 12/14/2004 - Many Contributors!
  7 # If you use this and have made improvements or have comments
  8 # drop me an email at linc dot fessenden at gmail dot com
  9 # I'd appreciate it!
 10 
 11 # ==>  ABS Guide extra comments.
 12 
 13 # ==>  Author of this script has kindly granted permission
 14 # ==>+ for inclusion in ABS Guide.
 15 
 16 
 17 # ==> ################################################################
 18 # 
 19 # ==> What is "podcasting"?
 20 
 21 # ==> It's broadcasting "radio shows" over the Internet.
 22 # ==> These shows can be played on iPods and other music file players.
 23 
 24 # ==> This script makes it possible.
 25 # ==> See documentation at the script author's site, above.
 26 
 27 # ==> ################################################################
 28 
 29 
 30 # Make script crontab friendly:
 31 cd $(dirname $0)
 32 # ==> Change to directory where this script lives.
 33 
 34 # datadir is the directory you want podcasts saved to:
 35 datadir=$(date +%Y-%m-%d)
 36 # ==> Will create a directory with the name: YYYY-MM-DD
 37 
 38 # Check for and create datadir if necessary:
 39 if test ! -d $datadir
 40         then
 41         mkdir $datadir
 42 fi
 43 
 44 # Delete any temp file:
 45 rm -f temp.log
 46 
 47 # Read the bp.conf file and wget any url not already in the podcast.log file:
 48 while read podcast
 49         do # ==> Main action follows.
 50         file=$(wget -q $podcast -O - | tr '\r' '\n' | tr \' \" | sed -n 's/.*url="\([^"]*\)".*/\1/p')
 51         for url in $file
 52                 do
 53                 echo $url >> temp.log
 54                 if ! grep "$url" podcast.log > /dev/null
 55                         then
 56                         wget -q -P $datadir "$url"
 57                 fi
 58                 done
 59         done < bp.conf
 60 
 61 # Move dynamically created log file to permanent log file:
 62 cat podcast.log >> temp.log
 63 sort temp.log | uniq > podcast.log
 64 rm temp.log
 65 # Create an m3u playlist:
 66 ls $datadir | grep -v m3u > $datadir/podcast.m3u
 67 
 68 
 69 exit 0
 70 
 71 #################################################
 72 For a different scripting approach to Podcasting,
 73 see Phil Salkie's article, 
 74 "Internet Radio to Podcast with Shell Tools"
 75 in the September, 2005 issue of LINUX JOURNAL,
 76 http://www.linuxjournal.com/article/8171
 77 #################################################</pre>

 |

* * *

作为本小节的结尾, 让我们回顾一下基本概念 . . . 可能还有些扩展部分.

* * *

**例子 A-32\. 基础回顾**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # basics-reviewed.bash
  3 
  4 # File extension == *.bash == specific to Bash
  5 
  6 #   Copyright (c) Michael S. Zick, 2003; All rights reserved.
  7 #   License: Use in any form, for any purpose.
  8 #   Revision: $ID$
  9 #
 10 #              Edited for layout by M.C.
 11 #   (author of the "Advanced Bash Scripting Guide")
 12 
 13 
 14 #  This script tested under Bash versions 2.04, 2.05a and 2.05b.
 15 #  It may not work with earlier versions.
 16 #  This demonstration script generates one --intentional--
 17 #+ "command not found" error message. See line 394.
 18 
 19 #  The current Bash maintainer, Chet Ramey, has fixed the items noted
 20 #+ for an upcoming version of Bash.
 21 
 22 
 23 
 24         ###-------------------------------------------###
 25         ###  Pipe the output of this script to 'more' ###
 26         ###+ else it will scroll off the page.        ###
 27         ###                                           ###
 28         ###  You may also redirect its output         ###
 29         ###+ to a file for examination.               ###  
 30         ###-------------------------------------------###
 31 
 32 
 33 
 34 #  Most of the following points are described at length in
 35 #+ the text of the foregoing "Advanced Bash Scripting Guide."
 36 #  This demonstration script is mostly just a reorganized presentation.
 37 #      -- msz
 38 
 39 # Variables are not typed unless otherwise specified.
 40 
 41 #  Variables are named. Names must contain a non-digit.
 42 #  File descriptor names (as in, for example: 2>&1)
 43 #+ contain ONLY digits.
 44 
 45 # Parameters and Bash array elements are numbered.
 46 # (Parameters are very similar to Bash arrays.)
 47 
 48 # A variable name may be undefined (null reference).
 49 unset VarNull
 50 
 51 # A variable name may be defined but empty (null contents).
 52 VarEmpty=''                         # Two, adjacent, single quotes.
 53 
 54 # A variable name my be defined and non-empty
 55 VarSomething='Literal'
 56 
 57 # A variable may contain:
 58 #   * A whole number as a signed 32-bit (or larger) integer
 59 #   * A string
 60 # A variable may also be an array.
 61 
 62 #  A string may contain embedded blanks and may be treated
 63 #+ as if it where a function name with optional arguments.
 64 
 65 #  The names of variables and the names of functions
 66 #+ are in different namespaces.
 67 
 68 
 69 #  A variable may be defined as a Bash array either explicitly or
 70 #+ implicitly by the syntax of the assignment statement.
 71 #  Explicit:
 72 declare -a ArrayVar
 73 
 74 
 75 
 76 # The echo command is a built-in.
 77 echo $VarSomething
 78 
 79 # The printf command is a built-in.
 80 # Translate %s as: String-Format
 81 printf %s $VarSomething         # No linebreak specified, none output.
 82 echo                            # Default, only linebreak output.
 83 
 84 
 85 
 86 
 87 # The Bash parser word breaks on whitespace.
 88 # Whitespace, or the lack of it is significant.
 89 # (This holds true in general; there are, of course, exceptions.)
 90 
 91 
 92 
 93 
 94 # Translate the DOLLAR_SIGN character as: Content-Of.
 95 
 96 # Extended-Syntax way of writing Content-Of:
 97 echo ${VarSomething}
 98 
 99 #  The ${ ... } Extended-Syntax allows more than just the variable
100 #+ name to be specified.
101 #  In general, $VarSomething can always be written as: ${VarSomething}.
102 
103 # Call this script with arguments to see the following in action.
104 
105 
106 
107 #  Outside of double-quotes, the special characters @ and *
108 #+ specify identical behavior.
109 #  May be pronounced as: All-Elements-Of.
110 
111 #  Without specification of a name, they refer to the
112 #+ pre-defined parameter Bash-Array.
113 
114 
115 
116 # Glob-Pattern references
117 echo $*                         # All parameters to script or function
118 echo ${*}                       # Same
119 
120 # Bash disables filename expansion for Glob-Patterns.
121 # Only character matching is active.
122 
123 
124 # All-Elements-Of references
125 echo $@                         # Same as above
126 echo ${@}                       # Same as above
127 
128 
129 
130 
131 #  Within double-quotes, the behavior of Glob-Pattern references
132 #+ depends on the setting of IFS (Input Field Separator).
133 #  Within double-quotes, All-Elements-Of references behave the same.
134 
135 
136 #  Specifying only the name of a variable holding a string refers
137 #+ to all elements (characters) of a string.
138 
139 
140 #  To specify an element (character) of a string,
141 #+ the Extended-Syntax reference notation (see below) MAY be used.
142 
143 
144 
145 
146 #  Specifying only the name of a Bash array references
147 #+ the subscript zero element,
148 #+ NOT the FIRST DEFINED nor the FIRST WITH CONTENTS element.
149 
150 #  Additional qualification is needed to reference other elements,
151 #+ which means that the reference MUST be written in Extended-Syntax.
152 #  The general form is: ${name[subscript]}.
153 
154 #  The string forms may also be used: ${name:subscript}
155 #+ for Bash-Arrays when referencing the subscript zero element.
156 
157 
158 # Bash-Arrays are implemented internally as linked lists,
159 #+ not as a fixed area of storage as in some programming languages.
160 
161 
162 #   Characteristics of Bash arrays (Bash-Arrays):
163 #   --------------------------------------------
164 
165 #   If not otherwise specified, Bash-Array subscripts begin with
166 #+  subscript number zero. Literally: [0]
167 #   This is called zero-based indexing.
168 ###
169 #   If not otherwise specified, Bash-Arrays are subscript packed
170 #+  (sequential subscripts without subscript gaps).
171 ###
172 #   Negative subscripts are not allowed.
173 ###
174 #   Elements of a Bash-Array need not all be of the same type.
175 ###
176 #   Elements of a Bash-Array may be undefined (null reference).
177 #       That is, a Bash-Array my be "subscript sparse."
178 ###
179 #   Elements of a Bash-Array may be defined and empty (null contents).
180 ###
181 #   Elements of a Bash-Array may contain:
182 #     * A whole number as a signed 32-bit (or larger) integer
183 #     * A string
184 #     * A string formated so that it appears to be a function name
185 #     + with optional arguments
186 ###
187 #   Defined elements of a Bash-Array may be undefined (unset).
188 #       That is, a subscript packed Bash-Array may be changed
189 #   +   into a subscript sparse Bash-Array.
190 ###
191 #   Elements may be added to a Bash-Array by defining an element
192 #+  not previously defined.
193 ###
194 # For these reasons, I have been calling them "Bash-Arrays".
195 # I'll return to the generic term "array" from now on.
196 #     -- msz
197 
198 
199 
200 
201 #  Demo time -- initialize the previously declared ArrayVar as a
202 #+ sparse array.
203 #  (The 'unset ... ' is just documentation here.)
204 
205 unset ArrayVar[0]                   # Just for the record
206 ArrayVar[1]=one                     # Unquoted literal
207 ArrayVar[2]=''                      # Defined, and empty
208 unset ArrayVar[3]                   # Just for the record
209 ArrayVar[4]='four'                  # Quoted literal
210 
211 
212 
213 # Translate the %q format as: Quoted-Respecting-IFS-Rules.
214 echo
215 echo '- - Outside of double-quotes - -'
216 ###
217 printf %q ${ArrayVar[*]}            # Glob-Pattern All-Elements-Of
218 echo
219 echo 'echo command:'${ArrayVar[*]}
220 ###
221 printf %q ${ArrayVar[@]}            # All-Elements-Of
222 echo
223 echo 'echo command:'${ArrayVar[@]}
224 
225 # The use of double-quotes may be translated as: Enable-Substitution.
226 
227 # There are five cases recognized for the IFS setting.
228 
229 echo
230 echo '- - Within double-quotes - Default IFS of space-tab-newline - -'
231 IFS=/pre>\x20'/pre>\x09'/pre>\x0A'           #  These three bytes,
232                                     #+ in exactly this order.
233 
234 
235 printf %q "${ArrayVar[*]}"          # Glob-Pattern All-Elements-Of
236 echo
237 echo 'echo command:'"${ArrayVar[*]}"
238 ###
239 printf %q "${ArrayVar[@]}"          # All-Elements-Of
240 echo
241 echo 'echo command:'"${ArrayVar[@]}"
242 
243 
244 echo
245 echo '- - Within double-quotes - First character of IFS is ^ - -'
246 # Any printing, non-whitespace character should do the same.
247 IFS='^'$IFS                         # ^ + space tab newline
248 ###
249 printf %q "${ArrayVar[*]}"          # Glob-Pattern All-Elements-Of
250 echo
251 echo 'echo command:'"${ArrayVar[*]}"
252 ###
253 printf %q "${ArrayVar[@]}"          # All-Elements-Of
254 echo
255 echo 'echo command:'"${ArrayVar[@]}"
256 
257 
258 echo
259 echo '- - Within double-quotes - Without whitespace in IFS - -'
260 IFS='^:%!'
261 ###
262 printf %q "${ArrayVar[*]}"          # Glob-Pattern All-Elements-Of
263 echo
264 echo 'echo command:'"${ArrayVar[*]}"
265 ###
266 printf %q "${ArrayVar[@]}"          # All-Elements-Of
267 echo
268 echo 'echo command:'"${ArrayVar[@]}"
269 
270 
271 echo
272 echo '- - Within double-quotes - IFS set and empty - -'
273 IFS=''
274 ###
275 printf %q "${ArrayVar[*]}"          # Glob-Pattern All-Elements-Of
276 echo
277 echo 'echo command:'"${ArrayVar[*]}"
278 ###
279 printf %q "${ArrayVar[@]}"          # All-Elements-Of
280 echo
281 echo 'echo command:'"${ArrayVar[@]}"
282 
283 
284 echo
285 echo '- - Within double-quotes - IFS undefined - -'
286 unset IFS
287 ###
288 printf %q "${ArrayVar[*]}"          # Glob-Pattern All-Elements-Of
289 echo
290 echo 'echo command:'"${ArrayVar[*]}"
291 ###
292 printf %q "${ArrayVar[@]}"          # All-Elements-Of
293 echo
294 echo 'echo command:'"${ArrayVar[@]}"
295 
296 
297 # Put IFS back to the default.
298 # Default is exactly these three bytes.
299 IFS=/pre>\x20'/pre>\x09'/pre>\x0A'           # In exactly this order.
300 
301 # Interpretation of the above outputs:
302 #   A Glob-Pattern is I/O; the setting of IFS matters.
303 ###
304 #   An All-Elements-Of does not consider IFS settings.
305 ###
306 #   Note the different output using the echo command and the
307 #+  quoted format operator of the printf command.
308 
309 
310 #  Recall:
311 #   Parameters are similar to arrays and have the similar behaviors.
312 ###
313 #  The above examples demonstrate the possible variations.
314 #  To retain the shape of a sparse array, additional script
315 #+ programming is required.
316 ###
317 #  The source code of Bash has a routine to output the
318 #+ [subscript]=value   array assignment format.
319 #  As of version 2.05b, that routine is not used,
320 #+ but that might change in future releases.
321 
322 
323 
324 # The length of a string, measured in non-null elements (characters):
325 echo
326 echo '- - Non-quoted references - -'
327 echo 'Non-Null character count: '${#VarSomething}' characters.'
328 
329 # test='Lit'/pre>\x00''eral'           # /pre>\x00' is a null character.
330 # echo ${#test}                     # See that?
331 
332 
333 
334 #  The length of an array, measured in defined elements,
335 #+ including null content elements.
336 echo
337 echo 'Defined content count: '${#ArrayVar[@]}' elements.'
338 # That is NOT the maximum subscript (4).
339 # That is NOT the range of the subscripts (1 . . 4 inclusive).
340 # It IS the length of the linked list.
341 ###
342 #  Both the maximum subscript and the range of the subscripts may
343 #+ be found with additional script programming.
344 
345 # The length of a string, measured in non-null elements (characters):
346 echo
347 echo '- - Quoted, Glob-Pattern references - -'
348 echo 'Non-Null character count: '"${#VarSomething}"' characters.'
349 
350 #  The length of an array, measured in defined elements,
351 #+ including null-content elements.
352 echo
353 echo 'Defined element count: '"${#ArrayVar[*]}"' elements.'
354 
355 #  Interpretation: Substitution does not effect the ${# ... } operation.
356 #  Suggestion:
357 #  Always use the All-Elements-Of character
358 #+ if that is what is intended (independence from IFS).
359 
360 
361 
362 #  Define a simple function.
363 #  I include an underscore in the name
364 #+ to make it distinctive in the examples below.
365 ###
366 #  Bash separates variable names and function names
367 #+ in different namespaces.
368 #  The Mark-One eyeball isn't that advanced.
369 ###
370 _simple() {
371     echo -n 'SimpleFunc'$@          #  Newlines are swallowed in
372 }                                   #+ result returned in any case.
373 
374 
375 # The ( ... ) notation invokes a command or function.
376 # The $( ... ) notation is pronounced: Result-Of.
377 
378 
379 # Invoke the function _simple
380 echo
381 echo '- - Output of function _simple - -'
382 _simple                             # Try passing arguments.
383 echo
384 # or
385 (_simple)                           # Try passing arguments.
386 echo
387 
388 echo '- Is there a variable of that name? -'
389 echo $_simple not defined           # No variable by that name.
390 
391 # Invoke the result of function _simple (Error msg intended)
392 
393 ###
394 $(_simple)                          # Gives an error message:
395 #                          line 394: SimpleFunc: command not found
396 #                          ---------------------------------------
397 
398 echo
399 ###
400 
401 #  The first word of the result of function _simple
402 #+ is neither a valid Bash command nor the name of a defined function.
403 ###
404 # This demonstrates that the output of _simple is subject to evaluation.
405 ###
406 # Interpretation:
407 #   A function can be used to generate in-line Bash commands.
408 
409 
410 # A simple function where the first word of result IS a bash command:
411 ###
412 _print() {
413     echo -n 'printf %q '$@
414 }
415 
416 echo '- - Outputs of function _print - -'
417 _print parm1 parm2                  # An Output NOT A Command.
418 echo
419 
420 $(_print parm1 parm2)               #  Executes: printf %q parm1 parm2
421                                     #  See above IFS examples for the
422                                     #+ various possibilities.
423 echo
424 
425 $(_print $VarSomething)             # The predictable result.
426 echo
427 
428 
429 
430 # Function variables
431 # ------------------
432 
433 echo
434 echo '- - Function variables - -'
435 # A variable may represent a signed integer, a string or an array.
436 # A string may be used like a function name with optional arguments.
437 
438 # set -vx                           #  Enable if desired
439 declare -f funcVar                  #+ in namespace of functions
440 
441 funcVar=_print                      # Contains name of function.
442 $funcVar parm1                      # Same as _print at this point.
443 echo
444 
445 funcVar=$(_print )                  # Contains result of function.
446 $funcVar                            # No input, No output.
447 $funcVar $VarSomething              # The predictable result.
448 echo
449 
450 funcVar=$(_print $VarSomething)     #  $VarSomething replaced HERE.
451 $funcVar                            #  The expansion is part of the
452 echo                                #+ variable contents.
453 
454 funcVar="$(_print $VarSomething)"   #  $VarSomething replaced HERE.
455 $funcVar                            #  The expansion is part of the
456 echo                                #+ variable contents.
457 
458 #  The difference between the unquoted and the double-quoted versions
459 #+ above can be seen in the "protect_literal.sh" example.
460 #  The first case above is processed as two, unquoted, Bash-Words.
461 #  The second case above is processed as one, quoted, Bash-Word.
462 
463 
464 
465 
466 # Delayed replacement
467 # -------------------
468 
469 echo
470 echo '- - Delayed replacement - -'
471 funcVar="$(_print '$VarSomething')" # No replacement, single Bash-Word.
472 eval $funcVar                       # $VarSomething replaced HERE.
473 echo
474 
475 VarSomething='NewThing'
476 eval $funcVar                       # $VarSomething replaced HERE.
477 echo
478 
479 # Restore the original setting trashed above.
480 VarSomething=Literal
481 
482 #  There are a pair of functions demonstrated in the
483 #+ "protect_literal.sh" and "unprotect_literal.sh" examples.
484 #  These are general purpose functions for delayed replacement literals
485 #+ containing variables.
486 
487 
488 
489 
490 
491 # REVIEW:
492 # ------
493 
494 #  A string can be considered a Classic-Array of elements (characters).
495 #  A string operation applies to all elements (characters) of the string
496 #+ (in concept, anyway).
497 ###
498 #  The notation: ${array_name[@]} represents all elements of the
499 #+ Bash-Array: array_name.
500 ###
501 #  The Extended-Syntax string operations can be applied to all
502 #+ elements of an array.
503 ###
504 #  This may be thought of as a For-Each operation on a vector of strings.
505 ###
506 #  Parameters are similar to an array.
507 #  The initialization of a parameter array for a script
508 #+ and a parameter array for a function only differ
509 #+ in the initialization of ${0}, which never changes its setting.
510 ###
511 #  Subscript zero of the script's parameter array contains
512 #+ the name of the script.
513 ###
514 #  Subscript zero of a function's parameter array DOES NOT contain
515 #+ the name of the function.
516 #  The name of the current function is accessed by the $FUNCNAME variable.
517 ###
518 #  A quick, review list follows (quick, not short).
519 
520 echo
521 echo '- - Test (but not change) - -'
522 echo '- null reference -'
523 echo -n ${VarNull-'NotSet'}' '          # NotSet
524 echo ${VarNull}                         # NewLine only
525 echo -n ${VarNull:-'NotSet'}' '         # NotSet
526 echo ${VarNull}                         # Newline only
527 
528 echo '- null contents -'
529 echo -n ${VarEmpty-'Empty'}' '          # Only the space
530 echo ${VarEmpty}                        # Newline only
531 echo -n ${VarEmpty:-'Empty'}' '         # Empty
532 echo ${VarEmpty}                        # Newline only
533 
534 echo '- contents -'
535 echo ${VarSomething-'Content'}          # Literal
536 echo ${VarSomething:-'Content'}         # Literal
537 
538 echo '- Sparse Array -'
539 echo ${ArrayVar[@]-'not set'}
540 
541 # ASCII-Art time
542 # State     Y==yes, N==no
543 #           -       :-
544 # Unset     Y       Y       ${# ... } == 0
545 # Empty     N       Y       ${# ... } == 0
546 # Contents  N       N       ${# ... } > 0
547 
548 #  Either the first and/or the second part of the tests
549 #+ may be a command or a function invocation string.
550 echo
551 echo '- - Test 1 for undefined - -'
552 declare -i t
553 _decT() {
554     t=$t-1
555 }
556 
557 # Null reference, set: t == -1
558 t=${#VarNull}                           # Results in zero.
559 ${VarNull- _decT }                      # Function executes, t now -1.
560 echo $t
561 
562 # Null contents, set: t == 0
563 t=${#VarEmpty}                          # Results in zero.
564 ${VarEmpty- _decT }                     # _decT function NOT executed.
565 echo $t
566 
567 # Contents, set: t == number of non-null characters
568 VarSomething='_simple'                  # Set to valid function name.
569 t=${#VarSomething}                      # non-zero length
570 ${VarSomething- _decT }                 # Function _simple executed.
571 echo $t                                 # Note the Append-To action.
572 
573 # Exercise: clean up that example.
574 unset t
575 unset _decT
576 VarSomething=Literal
577 
578 echo
579 echo '- - Test and Change - -'
580 echo '- Assignment if null reference -'
581 echo -n ${VarNull='NotSet'}' '          # NotSet NotSet
582 echo ${VarNull}
583 unset VarNull
584 
585 echo '- Assignment if null reference -'
586 echo -n ${VarNull:='NotSet'}' '         # NotSet NotSet
587 echo ${VarNull}
588 unset VarNull
589 
590 echo '- No assignment if null contents -'
591 echo -n ${VarEmpty='Empty'}' '          # Space only
592 echo ${VarEmpty}
593 VarEmpty=''
594 
595 echo '- Assignment if null contents -'
596 echo -n ${VarEmpty:='Empty'}' '         # Empty Empty
597 echo ${VarEmpty}
598 VarEmpty=''
599 
600 echo '- No change if already has contents -'
601 echo ${VarSomething='Content'}          # Literal
602 echo ${VarSomething:='Content'}         # Literal
603 
604 
605 # "Subscript sparse" Bash-Arrays
606 ###
607 #  Bash-Arrays are subscript packed, beginning with
608 #+ subscript zero unless otherwise specified.
609 ###
610 #  The initialization of ArrayVar was one way
611 #+ to "otherwise specify".  Here is the other way:
612 ###
613 echo
614 declare -a ArraySparse
615 ArraySparse=( [1]=one [2]='' [4]='four' )
616 # [0]=null reference, [2]=null content, [3]=null reference
617 
618 echo '- - Array-Sparse List - -'
619 # Within double-quotes, default IFS, Glob-Pattern
620 
621 IFS=/pre>\x20'/pre>\x09'/pre>\x0A'
622 printf %q "${ArraySparse[*]}"
623 echo
624 
625 #  Note that the output does not distinguish between "null content"
626 #+ and "null reference".
627 #  Both print as escaped whitespace.
628 ###
629 #  Note also that the output does NOT contain escaped whitespace
630 #+ for the "null reference(s)" prior to the first defined element.
631 ###
632 # This behavior of 2.04, 2.05a and 2.05b has been reported
633 #+ and may change in a future version of Bash.
634 
635 #  To output a sparse array and maintain the [subscript]=value
636 #+ relationship without change requires a bit of programming.
637 #  One possible code fragment:
638 ###
639 # local l=${#ArraySparse[@]}        # Count of defined elements
640 # local f=0                         # Count of found subscripts
641 # local i=0                         # Subscript to test
642 (                                   # Anonymous in-line function
643     for (( l=${#ArraySparse[@]}, f = 0, i = 0 ; f < l ; i++ ))
644     do
645         # 'if defined then...'
646         ${ArraySparse[$i]+ eval echo '\ ['$i']='${ArraySparse[$i]} ; (( f++ )) }
647     done
648 )
649 
650 # The reader coming upon the above code fragment cold
651 #+ might want to review "command lists" and "multiple commands on a line"
652 #+ in the text of the foregoing "Advanced Bash Scripting Guide."
653 ###
654 #  Note:
655 #  The "read -a array_name" version of the "read" command
656 #+ begins filling array_name at subscript zero.
657 #  ArraySparse does not define a value at subscript zero.
658 ###
659 #  The user needing to read/write a sparse array to either
660 #+ external storage or a communications socket must invent
661 #+ a read/write code pair suitable for their purpose.
662 ###
663 # Exercise: clean it up.
664 
665 unset ArraySparse
666 
667 echo
668 echo '- - Conditional alternate (But not change)- -'
669 echo '- No alternate if null reference -'
670 echo -n ${VarNull+'NotSet'}' '
671 echo ${VarNull}
672 unset VarNull
673 
674 echo '- No alternate if null reference -'
675 echo -n ${VarNull:+'NotSet'}' '
676 echo ${VarNull}
677 unset VarNull
678 
679 echo '- Alternate if null contents -'
680 echo -n ${VarEmpty+'Empty'}' '              # Empty
681 echo ${VarEmpty}
682 VarEmpty=''
683 
684 echo '- No alternate if null contents -'
685 echo -n ${VarEmpty:+'Empty'}' '             # Space only
686 echo ${VarEmpty}
687 VarEmpty=''
688 
689 echo '- Alternate if already has contents -'
690 
691 # Alternate literal
692 echo -n ${VarSomething+'Content'}' '        # Content Literal
693 echo ${VarSomething}
694 
695 # Invoke function
696 echo -n ${VarSomething:+ $(_simple) }' '    # SimpleFunc Literal
697 echo ${VarSomething}
698 echo
699 
700 echo '- - Sparse Array - -'
701 echo ${ArrayVar[@]+'Empty'}                 # An array of 'Empty'(ies)
702 echo
703 
704 echo '- - Test 2 for undefined - -'
705 
706 declare -i t
707 _incT() {
708     t=$t+1
709 }
710 
711 #  Note:
712 #  This is the same test used in the sparse array
713 #+ listing code fragment.
714 
715 # Null reference, set: t == -1
716 t=${#VarNull}-1                     # Results in minus-one.
717 ${VarNull+ _incT }                  # Does not execute.
718 echo $t' Null reference'
719 
720 # Null contents, set: t == 0
721 t=${#VarEmpty}-1                    # Results in minus-one.
722 ${VarEmpty+ _incT }                 # Executes.
723 echo $t'  Null content'
724 
725 # Contents, set: t == (number of non-null characters)
726 t=${#VarSomething}-1                # non-null length minus-one
727 ${VarSomething+ _incT }             # Executes.
728 echo $t'  Contents'
729 
730 # Exercise: clean up that example.
731 unset t
732 unset _incT
733 
734 # ${name?err_msg} ${name:?err_msg}
735 #  These follow the same rules but always exit afterwards
736 #+ if an action is specified following the question mark.
737 #  The action following the question mark may be a literal
738 #+ or a function result.
739 ###
740 #  ${name?} ${name:?} are test-only, the return can be tested.
741 
742 
743 
744 
745 # Element operations
746 # ------------------
747 
748 echo
749 echo '- - Trailing sub-element selection - -'
750 
751 #  Strings, Arrays and Positional parameters
752 
753 #  Call this script with multiple arguments
754 #+ to see the parameter selections.
755 
756 echo '- All -'
757 echo ${VarSomething:0}              # all non-null characters
758 echo ${ArrayVar[@]:0}               # all elements with content
759 echo ${@:0}                         # all parameters with content;
760                                     # ignoring parameter[0]
761 
762 echo
763 echo '- All after -'
764 echo ${VarSomething:1}              # all non-null after character[0]
765 echo ${ArrayVar[@]:1}               # all after element[0] with content
766 echo ${@:2}                         # all after param[1] with content
767 
768 echo
769 echo '- Range after -'
770 echo ${VarSomething:4:3}            # ral
771                                     # Three characters after
772                                     # character[3]
773 
774 echo '- Sparse array gotch -'
775 echo ${ArrayVar[@]:1:2}     #  four - The only element with content.
776                             #  Two elements after (if that many exist).
777                             #  the FIRST WITH CONTENTS
778                             #+ (the FIRST WITH  CONTENTS is being
779                             #+ considered as if it
780                             #+ were subscript zero).
781 #  Executed as if Bash considers ONLY array elements with CONTENT
782 #  printf %q "${ArrayVar[@]:0:3}"    # Try this one
783 
784 #  In versions 2.04, 2.05a and 2.05b,
785 #+ Bash does not handle sparse arrays as expected using this notation.
786 #
787 #  The current Bash maintainer, Chet Ramey, has corrected this
788 #+ for an upcoming version of Bash.
789 
790 
791 echo '- Non-sparse array -'
792 echo ${@:2:2}               # Two parameters following parameter[1]
793 
794 # New victims for string vector examples:
795 stringZ=abcABC123ABCabc
796 arrayZ=( abcabc ABCABC 123123 ABCABC abcabc )
797 sparseZ=( [1]='abcabc' [3]='ABCABC' [4]='' [5]='123123' )
798 
799 echo
800 echo ' - - Victim string - -'$stringZ'- - '
801 echo ' - - Victim array - -'${arrayZ[@]}'- - '
802 echo ' - - Sparse array - -'${sparseZ[@]}'- - '
803 echo ' - [0]==null ref, [2]==null ref, [4]==null content - '
804 echo ' - [1]=abcabc [3]=ABCABC [5]=123123 - '
805 echo ' - non-null-reference count: '${#sparseZ[@]}' elements'
806 
807 echo
808 echo '- - Prefix sub-element removal - -'
809 echo '- - Glob-Pattern match must include the first character. - -'
810 echo '- - Glob-Pattern may be a literal or a function result. - -'
811 echo
812 
813 
814 # Function returning a simple, Literal, Glob-Pattern
815 _abc() {
816     echo -n 'abc'
817 }
818 
819 echo '- Shortest prefix -'
820 echo ${stringZ#123}                 # Unchanged (not a prefix).
821 echo ${stringZ#$(_abc)}             # ABC123ABCabc
822 echo ${arrayZ[@]#abc}               # Applied to each element.
823 
824 # Fixed by Chet Ramey for an upcoming version of Bash.
825 # echo ${sparseZ[@]#abc}            # Version-2.05b core dumps.
826 
827 # The -it would be nice- First-Subscript-Of
828 # echo ${#sparseZ[@]#*}             # This is NOT valid Bash.
829 
830 echo
831 echo '- Longest prefix -'
832 echo ${stringZ##1*3}                # Unchanged (not a prefix)
833 echo ${stringZ##a*C}                # abc
834 echo ${arrayZ[@]##a*c}              # ABCABC 123123 ABCABC
835 
836 # Fixed by Chet Ramey for an upcoming version of Bash
837 # echo ${sparseZ[@]##a*c}           # Version-2.05b core dumps.
838 
839 echo
840 echo '- - Suffix sub-element removal - -'
841 echo '- - Glob-Pattern match must include the last character. - -'
842 echo '- - Glob-Pattern may be a literal or a function result. - -'
843 echo
844 echo '- Shortest suffix -'
845 echo ${stringZ%1*3}                 # Unchanged (not a suffix).
846 echo ${stringZ%$(_abc)}             # abcABC123ABC
847 echo ${arrayZ[@]%abc}               # Applied to each element.
848 
849 # Fixed by Chet Ramey for an upcoming version of Bash.
850 # echo ${sparseZ[@]%abc}            # Version-2.05b core dumps.
851 
852 # The -it would be nice- Last-Subscript-Of
853 # echo ${#sparseZ[@]%*}             # This is NOT valid Bash.
854 
855 echo
856 echo '- Longest suffix -'
857 echo ${stringZ%%1*3}                # Unchanged (not a suffix)
858 echo ${stringZ%%b*c}                # a
859 echo ${arrayZ[@]%%b*c}              # a ABCABC 123123 ABCABC a
860 
861 # Fixed by Chet Ramey for an upcoming version of Bash.
862 # echo ${sparseZ[@]%%b*c}           # Version-2.05b core dumps.
863 
864 echo
865 echo '- - Sub-element replacement - -'
866 echo '- - Sub-element at any location in string. - -'
867 echo '- - First specification is a Glob-Pattern - -'
868 echo '- - Glob-Pattern may be a literal or Glob-Pattern function result. - -'
869 echo '- - Second specification may be a literal or function result. - -'
870 echo '- - Second specification may be unspecified. Pronounce that'
871 echo '    as: Replace-With-Nothing (Delete) - -'
872 echo
873 
874 
875 
876 # Function returning a simple, Literal, Glob-Pattern
877 _123() {
878     echo -n '123'
879 }
880 
881 echo '- Replace first occurrence -'
882 echo ${stringZ/$(_123)/999}         # Changed (123 is a component).
883 echo ${stringZ/ABC/xyz}             # xyzABC123ABCabc
884 echo ${arrayZ[@]/ABC/xyz}           # Applied to each element.
885 echo ${sparseZ[@]/ABC/xyz}          # Works as expected.
886 
887 echo
888 echo '- Delete first occurrence -'
889 echo ${stringZ/$(_123)/}
890 echo ${stringZ/ABC/}
891 echo ${arrayZ[@]/ABC/}
892 echo ${sparseZ[@]/ABC/}
893 
894 #  The replacement need not be a literal,
895 #+ since the result of a function invocation is allowed.
896 #  This is general to all forms of replacement.
897 echo
898 echo '- Replace first occurrence with Result-Of -'
899 echo ${stringZ/$(_123)/$(_simple)}  # Works as expected.
900 echo ${arrayZ[@]/ca/$(_simple)}     # Applied to each element.
901 echo ${sparseZ[@]/ca/$(_simple)}    # Works as expected.
902 
903 echo
904 echo '- Replace all occurrences -'
905 echo ${stringZ//[b2]/X}             # X-out b's and 2's
906 echo ${stringZ//abc/xyz}            # xyzABC123ABCxyz
907 echo ${arrayZ[@]//abc/xyz}          # Applied to each element.
908 echo ${sparseZ[@]//abc/xyz}         # Works as expected.
909 
910 echo
911 echo '- Delete all occurrences -'
912 echo ${stringZ//[b2]/}
913 echo ${stringZ//abc/}
914 echo ${arrayZ[@]//abc/}
915 echo ${sparseZ[@]//abc/}
916 
917 echo
918 echo '- - Prefix sub-element replacement - -'
919 echo '- - Match must include the first character. - -'
920 echo
921 
922 echo '- Replace prefix occurrences -'
923 echo ${stringZ/#[b2]/X}             # Unchanged (neither is a prefix).
924 echo ${stringZ/#$(_abc)/XYZ}        # XYZABC123ABCabc
925 echo ${arrayZ[@]/#abc/XYZ}          # Applied to each element.
926 echo ${sparseZ[@]/#abc/XYZ}         # Works as expected.
927 
928 echo
929 echo '- Delete prefix occurrences -'
930 echo ${stringZ/#[b2]/}
931 echo ${stringZ/#$(_abc)/}
932 echo ${arrayZ[@]/#abc/}
933 echo ${sparseZ[@]/#abc/}
934 
935 echo
936 echo '- - Suffix sub-element replacement - -'
937 echo '- - Match must include the last character. - -'
938 echo
939 
940 echo '- Replace suffix occurrences -'
941 echo ${stringZ/%[b2]/X}             # Unchanged (neither is a suffix).
942 echo ${stringZ/%$(_abc)/XYZ}        # abcABC123ABCXYZ
943 echo ${arrayZ[@]/%abc/XYZ}          # Applied to each element.
944 echo ${sparseZ[@]/%abc/XYZ}         # Works as expected.
945 
946 echo
947 echo '- Delete suffix occurrences -'
948 echo ${stringZ/%[b2]/}
949 echo ${stringZ/%$(_abc)/}
950 echo ${arrayZ[@]/%abc/}
951 echo ${sparseZ[@]/%abc/}
952 
953 echo
954 echo '- - Special cases of null Glob-Pattern - -'
955 echo
956 
957 echo '- Prefix all -'
958 # null substring pattern means 'prefix'
959 echo ${stringZ/#/NEW}               # NEWabcABC123ABCabc
960 echo ${arrayZ[@]/#/NEW}             # Applied to each element.
961 echo ${sparseZ[@]/#/NEW}            # Applied to null-content also.
962                                     # That seems reasonable.
963 
964 echo
965 echo '- Suffix all -'
966 # null substring pattern means 'suffix'
967 echo ${stringZ/%/NEW}               # abcABC123ABCabcNEW
968 echo ${arrayZ[@]/%/NEW}             # Applied to each element.
969 echo ${sparseZ[@]/%/NEW}            # Applied to null-content also.
970                                     # That seems reasonable.
971 
972 echo
973 echo '- - Special case For-Each Glob-Pattern - -'
974 echo '- - - - This is a nice-to-have dream - - - -'
975 echo
976 
977 _GenFunc() {
978     echo -n ${0}                    # Illustration only.
979     # Actually, that would be an arbitrary computation.
980 }
981 
982 # All occurrences, matching the AnyThing pattern.
983 # Currently //*/ does not match null-content nor null-reference.
984 # /#/ and /%/ does match null-content but not null-reference.
985 echo ${sparseZ[@]//*/$(_GenFunc)}
986 
987 
988 #  A possible syntax would be to make
989 #+ the parameter notation used within this construct mean:
990 #   ${1} - The full element
991 #   ${2} - The prefix, if any, to the matched sub-element
992 #   ${3} - The matched sub-element
993 #   ${4} - The suffix, if any, to the matched sub-element
994 #
995 # echo ${sparseZ[@]//*/$(_GenFunc ${3})}   # Same as ${1} here.
996 # Perhaps it will be implemented in a future version of Bash.
997 
998 
999 exit 0</pre>

 |

* * *

* * *

**例子 A-33\. 一个扩展的**cd**命令**

| 

<pre class="PROGRAMLISTING">  1 ############################################################################
  2 #
  3 #       cdll
  4 #       by Phil Braham
  5 #
  6 #       ############################################
  7 #       Latest version of this script available from
  8 #       http://freshmeat.net/projects/cd/
  9 #       ############################################
 10 #
 11 #       .cd_new
 12 #
 13 #       An enhancement of the Unix cd command
 14 #
 15 #       There are unlimited stack entries and special entries. The stack
 16 #       entries keep the last cd_maxhistory
 17 #       directories that have been used. The special entries can be assigned
 18 #       to commonly used directories.
 19 #
 20 #       The special entries may be pre-assigned by setting the environment
 21 #       variables CDSn or by using the -u or -U command.
 22 #
 23 #       The following is a suggestion for the .profile file:
 24 #
 25 #               . cdll              #  Set up the cd command
 26 #       alias cd='cd_new'           #  Replace te cd command
 27 #               cd -U               #  Upload pre-assigned entries for
 28 #                                   #+ the stact and special entries
 29 #               cd -D               #  Set non-default mode
 30 #               alias @="cd_new @"  #  Allow @ to be used to get history
 31 #
 32 #       For help type:
 33 #
 34 #               cd -h or
 35 #               cd -H
 36 #
 37 #
 38 ############################################################################
 39 #
 40 #       Version 1.2.1
 41 #
 42 #       Written by Phil Braham - Realtime Software Pty Ltd
 43 #       (realtime@mpx.com.au)
 44 #       Please send any suggestions or enhancements to the author (also at
 45 #       phil@braham.net)
 46 #
 47 ############################################################################
 48 
 49 cd_hm ()
 50 {
 51         ${PRINTF} "%s" "cd [dir] [0-9] [@[s|h] [-g [<dir>]] [-d] [-D] [-r<n>] [dir|0-9] [-R<n>] [<dir>|0-9]
 52    [-s<n>] [-S<n>] [-u] [-U] [-f] [-F] [-h] [-H] [-v]
 53     <dir> Go to directory
 54     0-n         Goto previous directory (0 is previous, 1 is last but 1 etc)
 55                 n is up to max history (default is 50)
 56     @           List history and special entries
 57     @h          List history entries
 58     @s          List special entries
 59     -g [<dir>]  Go to literal name (bypass special names)
 60                 This is to allow access to dirs called '0','1','-h' etc
 61     -d          Change default action - verbose. (See note)
 62     -D          Change default action - silent. (See note)
 63     -s<n>       Go to the special entry <n>*
 64     -S<n>       Go to the special entry <n> and replace it with the current dir*
 65     -r<n> [<dir>] Go to directory <dir> and then put it on special entry <n>*
 66     -R<n> [<dir>] Go to directory <dir> and put current dir on special entry <n>*
 67     -a<n>       Alternative suggested directory. See note below.
 68     -f [<file>] File entries to <file>.
 69     -u [<file>] Update entries from <file>.
 70                 If no filename supplied then default file (${CDPath}${2:-"$CDFile"}) is used
 71                 -F and -U are silent versions
 72     -v          Print version number
 73     -h          Help
 74     -H          Detailed help
 75 
 76     *The special entries (0 - 9) are held until log off, replaced by another entry
 77      or updated with the -u command
 78 
 79     Alternative suggested directories:
 80     If a directory is not found then CD will suggest any possibilities. These are
 81     directories starting with the same letters and if any are found they are listed
 82     prefixed with -a<n> where <n> is a number.
 83     It's possible to go to the directory by entering cd -a<n> on the command line. 
 84     
 85     The directory for -r<n> or -R<n> may be a number. For example:
 86         $ cd -r3 4  Go to history entry 4 and put it on special entry 3
 87         $ cd -R3 4  Put current dir on the special entry 3 and go to history entry 4
 88         $ cd -s3    Go to special entry 3
 89     
 90     Note that commands R,r,S and s may be used without a number and refer to 0:
 91         $ cd -s     Go to special entry 0
 92         $ cd -S     Go to special entry 0 and make special entry 0 current dir
 93         $ cd -r 1   Go to history entry 1 and put it on special entry 0
 94         $ cd -r     Go to history entry 0 and put it on special entry 0
 95     "
 96         if ${TEST} "$CD_MODE" = "PREV"
 97         then
 98                 ${PRINTF} "$cd_mnset"
 99         else
100                 ${PRINTF} "$cd_mset"
101         fi
102 }
103 
104 cd_Hm ()
105 {
106         cd_hm
107         ${PRINTF} "%s" "
108         The previous directories (0-$cd_maxhistory) are stored in the
109         environment variables CD[0] - CD[$cd_maxhistory]
110         Similarly the special directories S0 - $cd_maxspecial are in
111         the environment variable CDS[0] - CDS[$cd_maxspecial]
112         and may be accessed from the command line
113 
114         The default pathname for the -f and -u commands is $CDPath
115         The default filename for the -f and -u commands is $CDFile
116 
117         Set the following environment variables:
118             CDL_PROMPTLEN  - Set to the length of prompt you require.
119                 Prompt string is set to the right characters of the
120                 current directory.
121                 If not set then prompt is left unchanged
122             CDL_PROMPT_PRE - Set to the string to prefix the prompt.
123                 Default is:
124                     non-root:  \"\\[\\e[01;34m\\]\"  (sets colour to blue).
125                     root:      \"\\[\\e[01;31m\\]\"  (sets colour to red).
126             CDL_PROMPT_POST    - Set to the string to suffix the prompt.
127                 Default is:
128                     non-root:  \"\\[\\e[00m\\]$\"   (resets colour and displays $).
129                     root:      \"\\[\\e[00m\\]#\"   (resets colour and displays #).
130             CDPath - Set the default path for the -f & -u options.
131                      Default is home directory
132             CDFile - Set the default filename for the -f & -u options.
133                      Default is cdfile
134         
135 "
136     cd_version
137 
138 }
139 
140 cd_version ()
141 {
142     printf "Version: ${VERSION_MAJOR}.${VERSION_MINOR} Date: ${VERSION_DATE}\n"
143 }
144 
145 #
146 # Truncate right.
147 #
148 # params:
149 #   p1 - string
150 #   p2 - length to truncate to
151 #
152 # returns string in tcd
153 #
154 cd_right_trunc ()
155 {
156     local tlen=${2}
157     local plen=${#1}
158     local str="${1}"
159     local diff
160     local filler="<--"
161     if ${TEST} ${plen} -le ${tlen}
162     then
163         tcd="${str}"
164     else
165         let diff=${plen}-${tlen}
166         elen=3
167         if ${TEST} ${diff} -le 2
168         then
169             let elen=${diff}
170         fi
171         tlen=-${tlen}
172         let tlen=${tlen}+${elen}
173         tcd=${filler:0:elen}${str:tlen}
174     fi
175 }
176 
177 #
178 # Three versions of do history:
179 #    cd_dohistory  - packs history and specials side by side
180 #    cd_dohistoryH - Shows only hstory
181 #    cd_dohistoryS - Shows only specials
182 #
183 cd_dohistory ()
184 {
185     cd_getrc
186         ${PRINTF} "History:\n"
187     local -i count=${cd_histcount}
188     while ${TEST} ${count} -ge 0
189     do
190         cd_right_trunc "${CD[count]}" ${cd_lchar}
191             ${PRINTF} "%2d %-${cd_lchar}.${cd_lchar}s " ${count} "${tcd}"
192 
193         cd_right_trunc "${CDS[count]}" ${cd_rchar}
194             ${PRINTF} "S%d %-${cd_rchar}.${cd_rchar}s\n" ${count} "${tcd}"
195         count=${count}-1
196     done
197 }
198 
199 cd_dohistoryH ()
200 {
201     cd_getrc
202         ${PRINTF} "History:\n"
203         local -i count=${cd_maxhistory}
204         while ${TEST} ${count} -ge 0
205         do
206                 ${PRINTF} "${count} %-${cd_flchar}.${cd_flchar}s\n" ${CD[$count]}
207                 count=${count}-1
208         done
209 }
210 
211 cd_dohistoryS ()
212 {
213     cd_getrc
214         ${PRINTF} "Specials:\n"
215         local -i count=${cd_maxspecial}
216         while ${TEST} ${count} -ge 0
217         do
218                 ${PRINTF} "S${count} %-${cd_flchar}.${cd_flchar}s\n" ${CDS[$count]}
219                 count=${count}-1
220         done
221 }
222 
223 cd_getrc ()
224 {
225     cd_flchar=$(stty -a | awk -F \; '/rows/ { print $2 $3 }' | awk -F \  '{ print $4 }')
226     if ${TEST} ${cd_flchar} -ne 0
227     then
228         cd_lchar=${cd_flchar}/2-5
229         cd_rchar=${cd_flchar}/2-5
230             cd_flchar=${cd_flchar}-5
231     else
232             cd_flchar=${FLCHAR:=75}  # cd_flchar is used for for the @s & @h history
233             cd_lchar=${LCHAR:=35}
234             cd_rchar=${RCHAR:=35}
235     fi
236 }
237 
238 cd_doselection ()
239 {
240         local -i nm=0
241         cd_doflag="TRUE"
242         if ${TEST} "${CD_MODE}" = "PREV"
243         then
244                 if ${TEST} -z "$cd_npwd"
245                 then
246                         cd_npwd=0
247                 fi
248         fi
249         tm=$(echo "${cd_npwd}" | cut -b 1)
250     if ${TEST} "${tm}" = "-"
251     then
252         pm=$(echo "${cd_npwd}" | cut -b 2)
253         nm=$(echo "${cd_npwd}" | cut -d $pm -f2)
254         case "${pm}" in
255                 a) cd_npwd=${cd_sugg[$nm]} ;;
256                 s) cd_npwd="${CDS[$nm]}" ;;
257                 S) cd_npwd="${CDS[$nm]}" ; CDS[$nm]=`pwd` ;;
258                 r) cd_npwd="$2" ; cd_specDir=$nm ; cd_doselection "$1" "$2";;
259                 R) cd_npwd="$2" ; CDS[$nm]=`pwd` ; cd_doselection "$1" "$2";;
260         esac
261     fi
262 
263         if ${TEST} "${cd_npwd}" != "." -a "${cd_npwd}" != ".." -a "${cd_npwd}" -le ${cd_maxhistory} >>/dev/null 2>&1
264         then
265                 cd_npwd=${CD[$cd_npwd]}
266         else
267                 case "$cd_npwd" in
268                          @)  cd_dohistory ; cd_doflag="FALSE" ;;
269                         @h) cd_dohistoryH ; cd_doflag="FALSE" ;;
270                         @s) cd_dohistoryS ; cd_doflag="FALSE" ;;
271                         -h) cd_hm ; cd_doflag="FALSE" ;;
272                         -H) cd_Hm ; cd_doflag="FALSE" ;;
273                         -f) cd_fsave "SHOW" $2 ; cd_doflag="FALSE" ;;
274                         -u) cd_upload "SHOW" $2 ; cd_doflag="FALSE" ;;
275                         -F) cd_fsave "NOSHOW" $2 ; cd_doflag="FALSE" ;;
276                         -U) cd_upload "NOSHOW" $2 ; cd_doflag="FALSE" ;;
277                         -g) cd_npwd="$2" ;;
278                         -d) cd_chdefm 1; cd_doflag="FALSE" ;;
279                         -D) cd_chdefm 0; cd_doflag="FALSE" ;;
280                         -r) cd_npwd="$2" ; cd_specDir=0 ; cd_doselection "$1" "$2";;
281                         -R) cd_npwd="$2" ; CDS[0]=`pwd` ; cd_doselection "$1" "$2";;
282                         -s) cd_npwd="${CDS[0]}" ;;
283                         -S) cd_npwd="${CDS[0]}"  ; CDS[0]=`pwd` ;;
284                         -v) cd_version ; cd_doflag="FALSE";;
285                 esac
286         fi
287 }
288 
289 cd_chdefm ()
290 {
291         if ${TEST} "${CD_MODE}" = "PREV"
292         then
293                 CD_MODE=""
294                 if ${TEST} $1 -eq 1
295                 then
296                         ${PRINTF} "${cd_mset}"
297                 fi
298         else
299                 CD_MODE="PREV"
300                 if ${TEST} $1 -eq 1
301                 then
302                         ${PRINTF} "${cd_mnset}"
303                 fi
304         fi
305 }
306 
307 cd_fsave ()
308 {
309         local sfile=${CDPath}${2:-"$CDFile"}
310         if ${TEST} "$1" = "SHOW"
311         then
312                 ${PRINTF} "Saved to %s\n" $sfile
313         fi
314         ${RM} -f ${sfile}
315         local -i count=0
316         while ${TEST} ${count} -le ${cd_maxhistory}
317         do
318                 echo "CD[$count]=\"${CD[$count]}\"" >> ${sfile}
319                 count=${count}+1
320         done
321         count=0
322         while ${TEST} ${count} -le ${cd_maxspecial}
323         do
324                 echo "CDS[$count]=\"${CDS[$count]}\"" >> ${sfile}
325                 count=${count}+1
326         done
327 }
328 
329 cd_upload ()
330 {
331         local sfile=${CDPath}${2:-"$CDFile"}
332         if ${TEST} "${1}" = "SHOW"
333         then
334                 ${PRINTF} "Loading from %s\n" ${sfile}
335         fi
336         . ${sfile}
337 }
338 
339 cd_new ()
340 {
341     local -i count
342     local -i choose=0
343 
344         cd_npwd="${1}"
345         cd_specDir=-1
346         cd_doselection "${1}" "${2}"
347 
348         if ${TEST} ${cd_doflag} = "TRUE"
349         then
350                 if ${TEST} "${CD[0]}" != "`pwd`"
351                 then
352                         count=$cd_maxhistory
353                         while ${TEST} $count -gt 0
354                         do
355                                 CD[$count]=${CD[$count-1]}
356                                 count=${count}-1
357                         done
358                         CD[0]=`pwd`
359                 fi
360                 command cd "${cd_npwd}" 2>/dev/null
361         if ${TEST} $? -eq 1
362         then
363             ${PRINTF} "Unknown dir: %s\n" "${cd_npwd}"
364             local -i ftflag=0
365             for i in "${cd_npwd}"*
366             do
367                 if ${TEST} -d "${i}"
368                 then
369                     if ${TEST} ${ftflag} -eq 0
370                     then
371                         ${PRINTF} "Suggest:\n"
372                         ftflag=1
373                 fi
374                     ${PRINTF} "\t-a${choose} %s\n" "$i"
375                                         cd_sugg[$choose]="${i}"
376                     choose=${choose}+1
377         fi
378             done
379         fi
380         fi
381 
382         if ${TEST} ${cd_specDir} -ne -1
383         then
384                 CDS[${cd_specDir}]=`pwd`
385         fi
386 
387         if ${TEST} ! -z "${CDL_PROMPTLEN}"
388         then
389         cd_right_trunc "${PWD}" ${CDL_PROMPTLEN}
390             cd_rp=${CDL_PROMPT_PRE}${tcd}${CDL_PROMPT_POST}
391                 export PS1="$(echo -ne ${cd_rp})"
392         fi
393 }
394 #################################################################################
395 #                                                                               #
396 #                            Initialisation here                                #
397 #                                                                               #
398 #################################################################################
399 #
400 VERSION_MAJOR="1"
401 VERSION_MINOR="2.1"
402 VERSION_DATE="24-MAY-2003"
403 #
404 alias cd=cd_new
405 #
406 # Set up commands
407 RM=/bin/rm
408 TEST=test
409 PRINTF=printf              # Use builtin printf
410 
411 #################################################################################
412 #                                                                               #
413 # Change this to modify the default pre- and post prompt strings.               #
414 # These only come into effect if CDL_PROMPTLEN is set.                          #
415 #                                                                               #
416 #################################################################################
417 if ${TEST} ${EUID} -eq 0
418 then
419 #   CDL_PROMPT_PRE=${CDL_PROMPT_PRE:="$HOSTNAME@"}
420     CDL_PROMPT_PRE=${CDL_PROMPT_PRE:="\\[\\e[01;31m\\]"}    # Root is in red
421     CDL_PROMPT_POST=${CDL_PROMPT_POST:="\\[\\e[00m\\]#"}
422 else
423     CDL_PROMPT_PRE=${CDL_PROMPT_PRE:="\\[\\e[01;34m\\]"}    # Users in blue
424     CDL_PROMPT_POST=${CDL_PROMPT_POST:="\\[\\e[00m\\]$"}
425 fi
426 #################################################################################
427 #
428 # cd_maxhistory defines the max number of history entries allowed.
429 typeset -i cd_maxhistory=50
430 
431 #################################################################################
432 #
433 # cd_maxspecial defines the number of special entries.
434 typeset -i cd_maxspecial=9
435 #
436 #
437 #################################################################################
438 #
439 # cd_histcount defines the number of entries displayed in the history command.
440 typeset -i cd_histcount=9
441 #
442 #################################################################################
443 export CDPath=${HOME}/
444 #  Change these to use a different                                              #
445 #+ default path and filename                                                    #
446 export CDFile=${CDFILE:=cdfile}                   # for the -u and -f commands  #
447 #
448 #################################################################################
449                                                                                 #
450 typeset -i cd_lchar cd_rchar cd_flchar
451                                #  This is the number of chars to allow for the  #
452 cd_flchar=${FLCHAR:=75}        #+ cd_flchar is used for for the @s & @h history #
453 
454 typeset -ax CD CDS
455 #
456 cd_mset="\n\tDefault mode is now set - entering cd with no parameters has the default action\n\tUse cd -d or -D for cd to go to previous directory with no parameters\n"
457 cd_mnset="\n\tNon-default mode is now set - entering cd with no parameters is the same as entering cd 0\n\tUse cd -d or -D to change default cd action\n"
458 
459 # ==================================================================== #
460 
461 
462 
463 : <<DOCUMENTATION
464 
465 Written by Phil Braham. Realtime Software Pty Ltd.
466 Released under GNU license. Free to use. Please pass any modifications
467 or comments to the author Phil Braham:
468 
469 realtime@mpx.com.au
470 ===============================================================================
471 
472 cdll is a replacement for cd and incorporates similar functionality to
473 the bash pushd and popd commands but is independent of them.
474 
475 This version of cdll has been tested on Linux using Bash. It will work
476 on most Linux versions but will probably not work on other shells without
477 modification.
478 
479 Introduction
480 ============
481 
482 cdll allows easy moving about between directories. When changing to a new
483 directory the current one is automatically put onto a stack. By default
484 50 entries are kept, but this is configurable. Special directories can be
485 kept for easy access - by default up to 10, but this is configurable. The
486 most recent stack entries and the special entries can be easily viewed.
487 
488 The directory stack and special entries can be saved to, and loaded from,
489 a file. This allows them to be set up on login, saved before logging out
490 or changed when moving project to project.
491 
492 In addition, cdll provides a flexible command prompt facility that allows,
493 for example, a directory name in colour that is truncated from the left
494 if it gets too long.
495 
496 
497 Setting up cdll
498 ===============
499 
500 Copy cdll to either your local home directory or a central directory
501 such as /usr/bin (this will require root access).
502 
503 Copy the file cdfile to your home directory. It will require read and
504 write access. This a default file that contains a directory stack and
505 special entries.
506 
507 To replace the cd command you must add commands to your login script.
508 The login script is one or more of:
509 
510     /etc/profile
511     ~/.bash_profile
512     ~/.bash_login
513     ~/.profile
514     ~/.bashrc
515     /etc/bash.bashrc.local
516     
517 To setup your login, ~/.bashrc is recommended, for global (and root) setup
518 add the commands to /etc/bash.bashrc.local
519     
520 To set up on login, add the command:
521     . <dir>/cdll
522 For example if cdll is in your local home directory:
523     . ~/cdll
524 If in /usr/bin then:
525     . /usr/bin/cdll
526 
527 If you want to use this instead of the buitin cd command then add:
528     alias cd='cd_new'
529 We would also recommend the following commands:
530     alias @='cd_new @'
531     cd -U
532     cd -D
533 
534 If you want to use cdll's prompt facilty then add the following:
535     CDL_PROMPTLEN=nn
536 Where nn is a number described below. Initially 99 would be suitable
537 number.
538 
539 Thus the script looks something like this:
540 
541     ######################################################################
542     # CD Setup
543     ######################################################################
544     CDL_PROMPTLEN=21        # Allow a prompt length of up to 21 characters
545     . /usr/bin/cdll         # Initialise cdll
546     alias cd='cd_new'       # Replace the built in cd command
547     alias @='cd_new @'      # Allow @ at the prompt to display history
548     cd -U                   # Upload directories
549     cd -D                   # Set default action to non-posix
550     ######################################################################
551 
552 The full meaning of these commands will become clear later.
553 
554 There are a couple of caveats. If another program changes the directory
555 without calling cdll, then the directory won't be put on the stack and
556 also if the prompt facility is used then this will not be updated. Two
557 programs that can do this are pushd and popd. To update the prompt and
558 stack simply enter:
559 
560     cd .
561     
562 Note that if the previous entry on the stack is the current directory
563 then the stack is not updated.
564 
565 Usage
566 =====  
567 cd [dir] [0-9] [@[s|h] [-g <dir>] [-d] [-D] [-r<n>] [dir|0-9] [-R<n>]
568    [<dir>|0-9] [-s<n>] [-S<n>] [-u] [-U] [-f] [-F] [-h] [-H] [-v]
569 
570     <dir>       Go to directory
571     0-n         Goto previous directory (0 is previous, 1 is last but 1, etc.)
572                 n is up to max history (default is 50)
573     @           List history and special entries (Usually available as $ @)
574     @h          List history entries
575     @s          List special entries
576     -g [<dir>]  Go to literal name (bypass special names)
577                 This is to allow access to dirs called '0','1','-h' etc
578     -d          Change default action - verbose. (See note)
579     -D          Change default action - silent. (See note)
580     -s<n>       Go to the special entry <n>
581     -S<n>       Go to the special entry <n> and replace it with the current dir
582     -r<n> [<dir>] Go to directory <dir> and then put it on special entry <n>
583     -R<n> [<dir>] Go to directory <dir> and put current dir on special entry <n>
584     -a<n>       Alternative suggested directory. See note below.
585     -f [<file>] File entries to <file>.
586     -u [<file>] Update entries from <file>.
587                 If no filename supplied then default file (~/cdfile) is used
588                 -F and -U are silent versions
589     -v          Print version number
590     -h          Help
591     -H          Detailed help
592 
593 
594 
595 Examples
596 ========
597 
598 These examples assume non-default mode is set (that is, cd with no
599 parameters will go to the most recent stack directory), that aliases
600 have been set up for cd and @ as described above and that cd's prompt
601 facility is active and the prompt length is 21 characters.
602 
603     /home/phil$ @                                                   # List the entries with the @
604     History:                                                        # Output of the @ command
605     .....                                                           # Skipped these entries for brevity
606     1 /home/phil/ummdev               S1 /home/phil/perl            # Most recent two history entries
607     0 /home/phil/perl/eg              S0 /home/phil/umm/ummdev      # and two special entries are shown
608     
609     /home/phil$ cd /home/phil/utils/Cdll                            # Now change directories
610     /home/phil/utils/Cdll$ @                                        # Prompt reflects the directory.
611     History:                                                        # New history
612     .....   
613     1 /home/phil/perl/eg              S1 /home/phil/perl            # History entry 0 has moved to 1
614     0 /home/phil                      S0 /home/phil/umm/ummdev      # and the most recent has entered
615        
616 To go to a history entry:
617 
618     /home/phil/utils/Cdll$ cd 1                                     # Go to history entry 1.
619     /home/phil/perl/eg$                                             # Current directory is now what was 1
620     
621 To go to a special entry:
622 
623     /home/phil/perl/eg$ cd -s1                                      # Go to special entry 1
624     /home/phil/umm/ummdev$                                          # Current directory is S1
625 
626 To go to a directory called, for example, 1:
627 
628     /home/phil$ cd -g 1                                             # -g ignores the special meaning of 1
629     /home/phil/1$
630     
631 To put current directory on the special list as S1:
632     cd -r1 .        #  OR
633     cd -R1 .        #  These have the same effect if the directory is
634                     #+ . (the current directory)
635 
636 To go to a directory and add it as a special  
637     The directory for -r<n> or -R<n> may be a number. For example:
638         $ cd -r3 4  Go to history entry 4 and put it on special entry 3
639         $ cd -R3 4  Put current dir on the special entry 3 and go to
640                     history entry 4
641         $ cd -s3    Go to special entry 3
642 
643     Note that commands R,r,S and s may be used without a number and
644     refer to 0:
645         $ cd -s     Go to special entry 0
646         $ cd -S     Go to special entry 0 and make special entry 0
647                     current dir
648         $ cd -r 1   Go to history entry 1 and put it on special entry 0
649         $ cd -r     Go to history entry 0 and put it on special entry 0
650 
651 
652     Alternative suggested directories:
653 
654     If a directory is not found, then CD will suggest any
655     possibilities. These are directories starting with the same letters
656     and if any are found they are listed prefixed with -a<n>
657     where <n> is a number. It's possible to go to the directory
658     by entering cd -a<n> on the command line.
659 
660         Use cd -d or -D to change default cd action. cd -H will show
661         current action.
662 
663         The history entries (0-n) are stored in the environment variables
664         CD[0] - CD[n]
665         Similarly the special directories S0 - 9 are in the environment
666         variable CDS[0] - CDS[9]
667         and may be accessed from the command line, for example:
668         
669             ls -l ${CDS[3]}
670             cat ${CD[8]}/file.txt
671 
672         The default pathname for the -f and -u commands is ~
673         The default filename for the -f and -u commands is cdfile
674 
675 
676 Configuration
677 =============
678 
679     The following environment variables can be set:
680     
681         CDL_PROMPTLEN  - Set to the length of prompt you require.
682             Prompt string is set to the right characters of the current
683             directory. If not set, then prompt is left unchanged. Note
684             that this is the number of characters that the directory is
685             shortened to, not the total characters in the prompt.
686 
687             CDL_PROMPT_PRE - Set to the string to prefix the prompt.
688                 Default is:
689                     non-root:  "\\[\\e[01;34m\\]"  (sets colour to blue).
690                     root:      "\\[\\e[01;31m\\]"  (sets colour to red).
691 
692             CDL_PROMPT_POST    - Set to the string to suffix the prompt.
693                 Default is:
694                     non-root:  "\\[\\e[00m\\]$"    (resets colour and displays $).
695                     root:      "\\[\\e[00m\\]#"    (resets colour and displays #).
696 
697         Note:
698             CDL_PROMPT_PRE & _POST only t
699 
700         CDPath - Set the default path for the -f & -u options.
701                  Default is home directory
702         CDFile - Set the default filename for the -f & -u options.
703                  Default is cdfile
704 
705 
706     There are three variables defined in the file cdll which control the
707     number of entries stored or displayed. They are in the section labeled
708     'Initialisation here' towards the end of the file.
709 
710         cd_maxhistory       - The number of history entries stored.
711                               Default is 50.
712         cd_maxspecial       - The number of special entries allowed.
713                               Default is 9.
714         cd_histcount        - The number of history and special entries
715                               displayed. Default is 9.
716 
717     Note that cd_maxspecial should be >= cd_histcount to avoid displaying
718     special entries that can't be set.
719 
720 
721 Version: 1.2.1 Date: 24-MAY-2003
722 
723 DOCUMENTATION</pre>

 |

* * *