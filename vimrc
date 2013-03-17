"Don't use vi keyboard schem, use vim himself
set nocompatible
set syntax=on
set autoindent
set cindent
"Tab's width
set tabstop=4
set softtabstop=4
set shiftwidth=4
set noexpandtab
set smarttab
set number
set history=1000
set nobackup
set noswapfile
set ignorecase
set enc=utf-8
set fencs=utf8,ucs-bom,shift-jis,gb18030,gbk,gb2312,cp936
set laststatus=2
set ruler
set cmdheight=2
filetype on
filetype plugin on
filetype indent on
set viminfo+=!
set iskeyword+=_,$,@,%,#,-
set backspace=indent,eol,start

set autochdir
set backupcopy=yes
set incsearch
set shortmess=atI
set showmatch
set cursorline
set smartindent
set autowrite
set magic

let Tlist_Sort_Type = "name"
"Show window in left
let Tlist_Use_Right_Window = 1

"Open javascript fold
let b:javascript_fold=1
let javascript_enable_domhtmlcss=1

function! MySys()
  if has("win16") || has("win32") || has("win64") || has("win95")
		return "windows"
	elseif has("unix")
		return "linux"
	endif
endfunction

if MySys() == "windows"
	let Tlist_Ctags_Cmd = '"'.VIMRUNTIME.'/ctags.ext"'
elseif MySys() == "linux"
	let Tlist_Ctags_Cmd = '/usr/bin/ctags'
endif
nnoremap <silent><F4> :TlistToggle<CR>

"C compile and run
map <F5> :call CompileRunGcc()<CR>
func! CompileRunGcc()
	exec "w"
	exec "!gcc % -o %<"
	exec "! ./%<"
endfunc

"C++ compile and run
map <F6> :call CompileRunGPP()<CR>
func! CompileRunGpp()
	exec "w"
	exec "!g++ % -o %<"
	exec "! ./%<"
endfunc

function! AddTitle()
	call setline(1, '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org//TR/html4/loose.dtd">')
endfunction
map html :call AddTitle()<CR>
  "html/xhtml editing in vim (写完>后自动不全结束标签)

function! InsertHtmlTag()
	let pat = '\c<\w\+\s*\(\s\+\w\+\s*=\s*[''#$;,()."a-z0-9]\+\)*\s*>'

    normal! a>

	let save_cursor = getpos('.')

    let result = matchstr(getline(save_cursor[1]), pat)

    "if (search(pat, 'b', save_cursor[1]) && searchpair('<','','>', 'bn',0,getline('.')) > 0)

    if (search(pat, 'b', save_cursor[1]))

        normal! lyiwf>

        normal! a</

        normal! p

        normal! a>

    endif

	:call cursor(save_cursor[1], save_cursor[2], save_cursor[3])

endfunction

inoremap > <ESC>:call InsertHtmlTag()<CR>a
