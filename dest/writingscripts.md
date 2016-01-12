# M.2\. 编写脚本

编写脚本来完成下面列出的每项任务.

译者: 家庭作业, 就不译了.

**EASY**

*   **Home Directory Listing**
*   Perform a recursive directory listing on the user's home directory and save the information to a file. Compress the file, have the script prompt the user to insert a floppy, then press **ENTER**. Finally, save the file to the floppy.

*   **Converting [for](loops1.md#FORLOOPREF1) loops to [while](loops1.md#WHILELOOPREF) and [until](loops1.md#UNTILLOOPREF) loops**
*   Convert the _for loops_ in [例子 10-1](loops1.md#EX22) to _while loops_. Hint: store the data in an [array](arrays.md#ARRAYREF) and step through the array elements.

    Having already done the <span class="QUOTE">"heavy lifting"</span>, now convert the loops in the example to _until loops_.

*   **Changing the line spacing of a text file**
*   Write a script that reads each line of a target file, then writes the line back to <tt class="FILENAME">stdout</tt>, but with an extra blank line following. This has the effect of _double-spacing_ the file.

    Include all necessary code to check whether the script gets the necessary command line argument (a filename), and whether the specified file exists.

    When the script runs correctly, modify it to _triple-space_ the target file.

    Finally, write a script to remove all blank lines from the target file, _single-spacing_ it.

*   **Backwards Listing**
*   Write a script that echoes itself to <tt class="FILENAME">stdout</tt>, but _backwards_.

*   **Automatically Decompressing Files**
*   Given a list of filenames as input, this script queries each target file (parsing the output of the [file](filearchiv.md#FILEREF) command) for the type of compression used on it. Then the script automatically invokes the appropriate decompression command (**gunzip**, **bunzip2**, **unzip**, **uncompress**, or whatever). If a target file is not compressed, the script emits a warning message, but takes no other action on that particular file.

*   **Unique System ID**
*   Generate a <span class="QUOTE">"unique"</span> 6-digit hexadecimal identifier for your computer. Do _not_ use the flawed [hostid](system.md#HOSTIDREF) command. Hint: **[md5sum](filearchiv.md#MD5SUMREF) <tt class="FILENAME">/etc/passwd</tt>**, then select the first 6 digits of output.

*   **Backup**
*   Archive as a <span class="QUOTE">"tarball"</span> (<tt class="FILENAME">*.tar.gz</tt> file) all the files in your home directory tree (<tt class="FILENAME">/home/your-name</tt>) that have been modified in the last 24 hours. Hint: use [find](moreadv.md#FINDREF).

*   **Checking whether a process is still running**
*   Given a [process ID](special-chars.md#PROCESSIDREF) (_PID_) as an argument, this script will check, at user-specified intervals, whether the given process is still running. You may use the [ps](system.md#PPSSREF) and [sleep](timedate.md#SLEEPREF) commands.

*   **Primes**
*   Print (to stdout) all prime numbers between 60000 and 63000\. The output should be nicely formatted in columns (hint: use [printf](internal.md#PRINTFREF)).

*   **Lottery Numbers**
*   One type of lottery involves picking five different numbers, in the range of 1 - 50\. Write a script that generates five pseudorandom numbers in this range, _with no duplicates_. The script will give the option of echoing the numbers to <tt class="FILENAME">stdout</tt> or saving them to a file, along with the date and time the particular number set was generated.

**INTERMEDIATE**

*   **Integer or String**
*   Write a script [function](functions.md#FUNCTIONREF) that determines if an argument passed to it is an integer or a string. The function will return TRUE (0) if passed an integer, and FALSE (1) if passed a string.

    Hint: What does the following expression return when `$1` is _not_ an integer?

    `expr $1 + 0`

*   **Managing Disk Space**
*   List, one at a time, all files larger than 100K in the <tt class="FILENAME">/home/username</tt> directory tree. Give the user the option to delete or compress the file, then proceed to show the next one. Write to a logfile the names of all deleted files and the deletion times.

*   **Removing Inactive Accounts**
*   Inactive accounts on a network waste disk space and may become a security risk. Write an administrative script (to be invoked by _root_ or the [cron daemon](system.md#CRONREF)) that checks for and deletes user accounts that have not been accessed within the last 90 days.

*   **Enforcing Disk Quotas**
*   Write a script for a multi-user system that checks users' disk usage. If a user surpasses the preset limit (100 MB, for example) in her <tt class="FILENAME">/home/username</tt> directory, then the script will automatically send her a warning e-mail.

    The script will use the [du](system.md#DUREF) and [mail](communications.md#COMMMAIL1) commands. As an option, it will allow setting and enforcing quotas using the [quota](system.md#QUOTAREF) and [setquota](system.md#SETQUOTAREF) commands.

*   **Logged in User Information**
*   For all logged in users, show their real names and the time and date of their last login.

    Hint: use [who](system.md#WHOREF), [lastlog](system.md#LASTLOGREF), and parse <tt class="FILENAME">/etc/passwd</tt>.

*   **Safe Delete**
*   Write, as a script, a <span class="QUOTE">"safe"</span> delete command, <tt class="FILENAME">srm.sh</tt>. Filenames passed as command-line arguments to this script are not deleted, but instead [gzipped](filearchiv.md#GZIPREF) if not already compressed (use [file](filearchiv.md#FILEREF) to check), then moved to a <tt class="FILENAME">/home/username/trash</tt> directory. At invocation, the script checks the <span class="QUOTE">"trash"</span> directory for files older than 48 hours and deletes them.

*   **Making Change**
*   What is the most efficient way to make change for $1.68, using only coins in common circulations (up to 25c)? It's 6 quarters, 1 dime, a nickel, and three cents.

    Given any arbitrary command line input in dollars and cents ($*.??), calculate the change, using the minimum number of coins. If your home country is not the United States, you may use your local currency units instead. The script will need to parse the command line input, then change it to multiples of the smallest monetary unit (cents or whatever). Hint: look at [例子 23-8](complexfunct.md#EX61).

*   **Quadratic Equations**
*   Solve a <span class="QUOTE">"quadratic"</span> equation of the form _Ax^2 + Bx + C = 0_. Have a script take as arguments the coefficients, <kbd class="USERINPUT">A</kbd>, <kbd class="USERINPUT">B</kbd>, and <kbd class="USERINPUT">C</kbd>, and return the solutions to four decimal places.

    Hint: pipe the coefficients to [bc](mathc.md#BCREF), using the well-known formula, _x = ( -B +/- sqrt( B^2 - 4AC ) ) / 2A_.

*   **Sum of Matching Numbers**
*   Find the sum of all five-digit numbers (in the range 10000 - 99999) containing _exactly two_ out of the following set of digits: { 4, 5, 6 }. These may repeat within the same number, and if so, they count once for each occurrence.

    Some examples of matching numbers are 42057, 74638, and 89515.

*   **Lucky Numbers**
*   A "lucky number" is one whose individual digits add up to 7, in successive additions. For example, 62431 is a "lucky number" (6 + 2 + 4 + 3 + 1 = 16, 1 + 6 = 7). Find all the "lucky numbers" between 1000 and 10000.

*   **Alphabetizing a String**
*   Alphabetize (in ASCII order) an arbitrary string read from the command line.

*   **Parsing**
*   Parse <tt class="FILENAME">/etc/passwd</tt>, and output its contents in nice, easy-to-read tabular form.

*   **Logging Logins**
*   Parse <tt class="FILENAME">/var/log/messages</tt> to produce a nicely formatted file of user logins and login times. The script may need to run as root. (Hint: Search for the string <span class="QUOTE">"LOGIN."</span>)

*   **Pretty-Printing a Data File**
*   Certain database and spreadsheet packages use save-files with _comma-separated values_ (CSVs). Other applications often need to parse these files.

    Given a data file with comma-separated fields, of the form:

    | 

    <pre class="PROGRAMLISTING">  1 Jones,Bill,235 S. Williams St.,Denver,CO,80221,(303) 244-7989
      2 Smith,Tom,404 Polk Ave.,Los Angeles,CA,90003,(213) 879-5612
      3 ...</pre>

     |

    Reformat the data and print it out to <tt class="FILENAME">stdout</tt> in labeled, evenly-spaced columns.
*   **Justification**
*   Given ASCII text input either from <tt class="FILENAME">stdin</tt> or a file, adjust the word spacing to right-justify each line to a user-specified line-width, then send the output to <tt class="FILENAME">stdout</tt>.

*   **Mailing List**
*   Using the [mail](communications.md#COMMMAIL1) command, write a script that manages a simple mailing list. The script automatically e-mails the monthly company newsletter, read from a specified text file, and sends it to all the addresses on the mailing list, which the script reads from another specified file.

*   **Generating Passwords**
*   Generate pseudorandom 8-character passwords, using characters in the ranges [0-9], [A-Z], [a-z]. Each password must contain at least two digits.

*   **Checking for Broken Links**
*   Using [lynx](communications.md#LYNXREF) with the `-traversal` option, write a script that checks a Web site for broken links.

**DIFFICULT**

*   **Testing Passwords**
*   Write a script to check and validate passwords. The object is to flag <span class="QUOTE">"weak"</span> or easily guessed password candidates.

    A trial password will be input to the script as a command line parameter. To be considered acceptable, a password must meet the following minimum qualifications:

    *   Minimum length of 8 characters

    *   Must contain at least one numeric character

    *   Must contain at least one of the following non-alphabetic characters: <span class="TOKEN">@</span>, <span class="TOKEN">#</span>, <span class="TOKEN">$</span>, <span class="TOKEN">%</span>, <span class="TOKEN">&</span>, <span class="TOKEN">*</span>, <span class="TOKEN">+</span>, <span class="TOKEN">-</span>, <span class="TOKEN">=</span>

    Optional:

    *   Do a dictionary check on every sequence of at least four consecutive alphabetic characters in the password under test. This will eliminate passwords containing embedded <span class="QUOTE">"words"</span> found in a standard dictionary.

    *   Enable the script to check all the passwords on your system. These may or may not reside in <tt class="FILENAME">/etc/passwd</tt>.

    This exercise tests mastery of [Regular Expressions](regexp.md#REGEXREF).

*   **Logging File Accesses**
*   Log all accesses to the files in <tt class="FILENAME">/etc</tt> during the course of a single day. This information should include the filename, user name, and access time. If any alterations to the files take place, that should be flagged. Write this data as neatly formatted records in a logfile.

*   **Monitoring Processes**
*   Write a script to continually monitor all running processes and to keep track of how many child processes each parent spawns. If a process spawns more than five children, then the script sends an e-mail to the system administrator (or root) with all relevant information, including the time, PID of the parent, PIDs of the children, etc. The script writes a report to a log file every ten minutes.

*   **Strip Comments**
*   Strip all comments from a shell script whose name is specified on the command line. Note that the <span class="QUOTE">"#! line"</span> must not be stripped out.

*   **HTML Conversion**
*   Convert a given text file to HTML. This non-interactive script automatically inserts all appropriate HTML tags into a file specified as an argument.

*   **Strip HTML Tags**
*   Strip all HTML tags from a specified HTML file, then reformat it into lines between 60 and 75 characters in length. Reset paragraph and block spacing, as appropriate, and convert HTML tables to their approximate text equivalent.

*   **XML Conversion**
*   Convert an XML file to both HTML and text format.

*   **Chasing Spammers**
*   Write a script that analyzes a spam e-mail by doing DNS lookups on the IP addresses in the headers to identify the relay hosts as well as the originating ISP. The script will forward the unaltered spam message to the responsible ISPs. Of course, it will be necessary to filter out _your own ISP's IP address_, so you don't end up complaining about yourself.

    As necessary, use the appropriate [network analysis commands](communications.md#COMMUNINFO1).

    For some ideas, see [例子 12-37](communications.md#ISSPAMMER) and [例子 A-28](contributed-scripts.md#ISSPAMMER2).

    Optional: Write a script that searches through a batch of e-mail messages and deletes the spam according to specified filters.

*   **Creating man pages**
*   Write a script that automates the process of creating _man pages_.

    Given a text file which contains information to be formatted into a _man page_, the script will read the file, then invoke the appropriate [groff](textproc.md#GROFFREF) commands to output the corresponding _man page_ to <tt class="FILENAME">stdout</tt>. The text file contains blocks of information under the standard _man page_ headings, i.e., <span class="QUOTE">"NAME,"</span> <span class="QUOTE">"SYNOPSIS,"</span> <span class="QUOTE">"DESCRIPTION,"</span> etc.

    See [例子 12-26](textproc.md#MANVIEW).

*   **Morse Code**
*   Convert a text file to Morse code. Each character of the text file will be represented as a corresponding Morse code group of dots and dashes (underscores), separated by whitespace from the next. For example, <span class="QUOTE">"script"</span> ===> <span class="QUOTE">"... _._. ._. .. .__. _"</span>.

*   **Hex Dump**
*   Do a hex(adecimal) dump on a binary file specified as an argument. The output should be in neat tabular fields, with the first field showing the address, each of the next 8 fields a 4-byte hex number, and the final field the ASCII equivalent of the previous 8 fields.

*   **Emulating a Shift Register**
*   Using [例子 26-14](arrays.md#STACKEX) as an inspiration, write a script that emulates a 64-bit shift register as an [array](arrays.md#ARRAYREF). Implement functions to _load_ the register, _shift left_, _shift right_, and _rotate_ it. Finally, write a function that interprets the register contents as eight 8-bit ASCII characters.

*   **Determinant**
*   Solve a 4 x 4 determinant.

*   **Hidden Words**
*   Write a <span class="QUOTE">"word-find"</span> puzzle generator, a script that hides 10 input words in a 10 x 10 matrix of random letters. The words may be hidden across, down, or diagonally.

    Optional: Write a script that _solves_ word-find puzzles. To keep this from becoming too difficult, the solution script will find only horizontal and vertical words. (Hint: Treat each row and column as a string, and search for substrings.)

*   **Anagramming**
*   Anagram 4-letter input. For example, the anagrams of _word_ are: _do or rod row word_. You may use <tt class="FILENAME">/usr/share/dict/linux.words</tt> as the reference list.

*   <span class="QUOTE">"**Word Ladders**"</span>
*   A <span class="QUOTE">"word ladder"</span> is a sequence of words, with each successive word in the sequence differing from the previous one by a single letter.

    For example, to <span class="QUOTE">"ladder"</span> from _mark_ to _vase_:

    | 

    <pre class="PROGRAMLISTING">  1 mark --> park --> part --> past --> vast --> vase</pre>

     |

    Write a script that solves <span class="QUOTE">"word ladder"</span> puzzles. Given a starting and an ending word, the script will list all intermediate steps in the <span class="QUOTE">"ladder"</span>. Note that _all_ words in the sequence must be <span class="QUOTE">"legal."</span>

*   **Fog Index**
*   The <span class="QUOTE">"fog index"</span> of a passage of text estimates its reading difficulty, as a number corresponding roughly to a school grade level. For example, a passage with a fog index of 12 should be comprehensible to anyone with 12 years of schooling.

    The Gunning version of the fog index uses the following algorithm.

    1.  Choose a section of the text at least 100 words in length.

    2.  Count the number of sentences (a portion of a sentence truncated by the boundary of the text section counts as one).

    3.  Find the average number of words per sentence.

        AVE_WDS_SEN = TOTAL_WORDS / SENTENCES

    4.  Count the number of <span class="QUOTE">"difficult"</span> words in the segment -- those containing at least 3 syllables. Divide this quantity by total words to get the proportion of difficult words.

        PRO_DIFF_WORDS = LONG_WORDS / TOTAL_WORDS

    5.  The Gunning fog index is the sum of the above two quantities, multiplied by 0.4, then rounded to the nearest integer.

        G_FOG_INDEX = int ( 0.4 * ( AVE_WDS_SEN + PRO_DIFF_WORDS ) )

    Step 4 is by far the most difficult portion of the exercise. There exist various algorithms for estimating the syllable count of a word. A rule-of-thumb formula might consider the number of letters in a word and the vowel-consonant mix.

    A strict interpretation of the Gunning fog index does not count compound words and proper nouns as <span class="QUOTE">"difficult"</span> words, but this would enormously complicate the script.

*   **Calculating PI using Buffon's Needle**
*   The Eighteenth Century French mathematician de Buffon came up with a novel experiment. Repeatedly drop a needle of length <span class="QUOTE">"n"</span> onto a wooden floor composed of long and narrow parallel boards. The cracks separating the equal-width floorboards are a fixed distance <span class="QUOTE">"d"</span> apart. Keep track of the total drops and the number of times the needle intersects a crack on the floor. The ratio of these two quantities turns out to be a fractional multiple of PI.

    In the spirit of [例子 12-45](mathc.md#CANNON), write a script that runs a Monte Carlo simulation of Buffon's Needle. To simplify matters, set the needle length equal to the distance between the cracks, _n = d_.

    Hint: there are actually two critical variables: the distance from the center of the needle to the crack nearest to it, and the angle of the needle to that crack. You may use [bc](mathc.md#BCREF) to handle the calculations.

*   **Playfair Cipher**
*   Implement the Playfair (Wheatstone) Cipher in a script.

    The Playfair Cipher encrypts text by substitution of <span class="QUOTE">"digrams"</span> (2-letter groupings). It is traditional to use a 5 x 5 letter scrambled-alphabet _key square_ for the encryption and decryption.

    | 

    <pre class="PROGRAMLISTING">  1    C O D E S
      2    A B F G H
      3    I K L M N
      4    P Q R T U
      5    V W X Y Z
      6 
      7 Each letter of the alphabet appears once, except "I" also represents
      8 "J". The arbitrarily chosen key word, "CODES" comes first, then all
      9 the rest of the alphabet, in order from left to right, skipping letters
     10 already used.
     11 
     12 To encrypt, separate the plaintext message into digrams (2-letter
     13 groups). If a group has two identical letters, delete the second, and
     14 form a new group. If there is a single letter left over at the end,
     15 insert a "null" character, typically an "X."
     16 
     17 THIS IS A TOP SECRET MESSAGE
     18 
     19 TH IS IS AT OP SE CR ET ME SA GE
     20 
     21 For each digram, there are three possibilities.
     22 ----------------------------------------------
     23 1) Both letters will be on the same row of the key square
     24    For each letter, substitute the one immediately to the right, in that
     25    row. If necessary, wrap around left to the beginning of the row.
     26 
     27 or
     28 
     29 2) Both letters will be in the same column of the key square
     30    For each letter, substitute the one immediately below it, in that
     31    row. If necessary, wrap around to the top of the column.
     32 
     33 or
     34 
     35 3) Both letters will form the corners of a rectangle within the key
     36    square. For each letter, substitute the one on the other corner the
     37    rectangle which lies on the same row.
     38 
     39 
     40 The "TH" digram falls under case #3.
     41 G H
     42 M N
     43 T U           (Rectangle with "T" and "H" at corners)
     44 
     45 T --> U
     46 H --> G
     47 
     48 
     49 The "SE" digram falls under case #1.
     50 C O D E S     (Row containing "S" and "E")
     51 
     52 S --> C  (wraps around left to beginning of row)
     53 E --> S
     54 
     55 =========================================================================
     56 
     57 To decrypt encrypted text, reverse the above procedure under cases #1
     58 and #2 (move in opposite direction for substitution). Under case #3,
     59 just take the remaining two corners of the rectangle.
     60 
     61 
     62 Helen Fouche Gaines' classic work, ELEMENTARY CRYPTANALYSIS (1939), gives a
     63 fairly detailed rundown on the Playfair Cipher and its solution methods.</pre>

     |

    This script will have three main sections

    1.  Generating the <span class="QUOTE">"key square"</span>, based on a user-input keyword.

    2.  Encrypting a <span class="QUOTE">"plaintext"</span> message.

    3.  Decrypting encrypted text.

    The script will make extensive use of [arrays](arrays.md#ARRAYREF) and [functions](functions.md#FUNCTIONREF).

--

Please do not send the author your solutions to these exercises. There are better ways to impress him with your cleverness, such as submitting bugfixes and suggestions for improving this book.