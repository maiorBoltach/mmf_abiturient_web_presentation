$d = document;


/*Menu*/
$items = [
    ['Специальности и проходной балл', 'programmes'],
    ['Технологии', 'technologies'],
    ['Фирмы-партнеры', 'partners'],
    ['Зарплаты в ИТ', 'salaries'],
    ['Международное сотрудничество', 'international-cooperation'],
    ['Студенческая жизнь', 'student-life'],
    ['Выпускники', 'graduates']
];
$nav = $d.createElement('nav');
$d.body.insertBefore($nav, $d.body.firstChild);
$nav = $d.getElementsByTagName('nav')[0];
for ($i = 0; $i < $items.length; $i++)
{
    $a = $d.createElement('a');
    $text = $d.createTextNode($items[$i][0]);
    $a.appendChild($text);
    if ($d.URL.indexOf($items[$i][1]) === -1) {
        $href = $d.createAttribute('href');
        $href.value = $items[$i][1] + '.html';
        $a.setAttributeNode($href);
    }
    else
    {
        $class = $d.createAttribute('class');
        $class.value = 'current';
        $a.setAttributeNode($class);
        $d.getElementsByTagName('title')[0].innerText = $items[$i][0] + ' - Мехмат 2017';
    }
    $nav.appendChild($a);
}
if ($d.URL.indexOf('index') !== -1) {
    $d.getElementsByTagName('title')[0].innerText = 'Мехмат 2017 - Презентация для абитуриентов';
}


//Footer
$footer = $d.createElement('footer');
$a = $d.createElement('a');
$title = $d.createTextNode('Мехмат БГУ');
$a.appendChild($title);
$href = $d.createAttribute("href");
$href.value = 'http://mmf.bsu.by';
$a.setAttributeNode($href);
$target = $d.createAttribute("target");
$target.value = '_blank';
$a.setAttributeNode($target);
$campaign = $d.createTextNode('Презентация для абитуриентов. Вступительная кампания 2017');
$footer.appendChild($campaign);
//$footer.appendChild($a);
$d.body.insertBefore($footer, $nav);


//Logo
$logo = $d.createElement('img');
$src = $d.createAttribute('src');
$src.value = 'mmf_logo_rus.svg';
$logo.setAttributeNode($src);
$class = $d.createAttribute('class');
$class.value = 'logo';
$logo.setAttributeNode($class);
if ($d.URL.indexOf('index.html') === -1) {
    $a = $d.createElement('a');
    $href = $d.createAttribute('href');
    $href.value = 'index.html';
    $a.setAttributeNode($href);
    $a.appendChild($logo);
    $d.body.insertBefore($a, $nav);
}
else {
    $d.body.insertBefore($logo, $nav);
}


//Salaries
$bars = $d.getElementsByClassName('bar');
for ($i = 0; $i < $bars.length; $i++)
{
    $height = $bars[$i].firstChild.innerText;
    $bars[$i].style.height = $height / 3 + 'px';
}
$salaries = new Array();
for ($i = 0; $i < $bars.length; $i++)
{
    $salaries[$i] = $bars[$i].offsetHeight;
}
$max = Math.max.apply(Math, $salaries);
for ($i = 0; $i < $bars.length; $i++)
{
    $bars[$i].style.position = 'relative';
    $bars[$i].style.top = $max - $bars[$i].offsetHeight + 'px';
    $bars[$i].childNodes[1].style.position = 'relative';
    $bars[$i].childNodes[2].style.position = 'relative';
}
$bar_width = ($d.body.offsetWidth - ($bars.length - 1) * 25) / $bars.length;
for ($i = 0; $i < $bars.length; $i++)
{
    $bars[$i].style.width = $bar_width + 'px';
}


//Menu stretching
$menu_links = $d.getElementsByTagName('nav')[0].getElementsByTagName('a');
$links_width = 0;
for ($i = 0; $i < $menu_links.length; $i++)
{
    $links_width += $menu_links[$i].offsetWidth;
}
$difference = $d.body.offsetWidth - $links_width - 25 * ($menu_links.length - 1);
$extend = $difference / $menu_links.length;
$extended_widths_sum = 0;
for ($i = 0; $i < $menu_links.length; $i++)
{
    $extended_width = $menu_links[$i].offsetWidth + $extend;
    $menu_links[$i].style.width = $extended_width + 'px';
    $extended_widths_sum += $extended_width;

}
$extended_widths_sum += 25 * ($menu_links.length - 1);
$reminder = $d.body.offsetWidth - $extended_widths_sum;
$last_menu_link = $menu_links[$menu_links.length - 1];
$last_menu_link.style.width = $last_menu_link.offsetWidth + $reminder + 'px';


//Footer repositioning
/*
$footer = $d.getElementsByTagName('footer')[0];
console.dir(window.innerHeight);
console.log($d.body.offsetHeight);
console.dir($d.body.offsetTop);
console.dir($footer.offsetTop);

if ($d.body.offsetHeight < window.innerHeight) {
    $footer.style.position = 'fixed';
    $footer.style.bottom = '0px';
} else
{
    $footer.style.position = 'static';
    $footer.style.bottom = '50px';
}
*/