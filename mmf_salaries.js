var $d = document;
var $container = $d.getElementsByClassName('content-area')[0];
var $li = $container.getElementsByTagName('ul')[0].getElementsByTagName('li')[0];
var $h2 = $container.getElementsByTagName('h2')[0];
var $salaries_container = $d.getElementsByClassName('salaries')[0];
var $salaries = $salaries_container.getElementsByClassName('salary');
var $digit_offset_widths = new Array();
var $dollars = new Array();

for ($i = 0; $i < $salaries.length; $i++)
{
    var $amount = $salaries[$i].getElementsByClassName('amount')[0];
    var $dollar = $amount.innerText;
    $dollars[$i] = $dollar;
    var $month = $salaries[$i].getElementsByClassName('month')[0];
    var $year = $salaries[$i].getElementsByClassName('year')[0];
    var $digit_width = $amount.offsetWidth;
    $digit_offset_widths[$i] = $digit_width;
    var $bar = $salaries[$i].getElementsByClassName('bar')[0];
    $bar.innerText = ' ' + $month.innerText + ' ' + $year.innerText;
}
var $dollars_max = Math.max.apply(null, $dollars);
var $digit_max_offset_width = Math.max.apply(null, $digit_offset_widths);

function stretch_salaries() {
    $salaries_margin = $li.offsetLeft - $h2.offsetLeft;
    //$salaries_container.style.marginLeft = $salaries_margin + 'px';
    for ($i = 0; $i < $salaries.length; $i++)
    {
        $bar = $salaries[$i].getElementsByClassName('bar')[0];
        $available_width = $salaries_container.offsetWidth - $digit_max_offset_width - 6.25;
        $bar.style.width = $available_width / $dollars_max * $dollars[$i] + 'px';
    }
}

window.addEventListener('resize', stretch_salaries);
window.addEventListener('onload', stretch_salaries());