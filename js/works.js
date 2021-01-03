
var queryString = window.location.search;

var sel_section = queryString.replace("?","")

if (sel_section == ""){
	console.log('no selected section')
}else{
	d3.selectAll('.works_session')
		.style('display','none')

	d3.select("#"+sel_section+"_session")
		.style("display",'inline')

	d3.selectAll(".works_sub_menu_li")
		.attr('class','works_sub_menu_li')

	d3.select("#"+sel_section)
		.attr('class','works_sub_menu_li selected_li')
}

d3.selectAll('.works_sub_menu_li')
	.on('click',left_menu_click)

function left_menu_click(){
	// console.log(this.id)

	d3.selectAll('.works_session')
		.style('display','none')

	d3.select("#"+this.id+"_session")
		.style("display",'inline')

	d3.selectAll(".works_sub_menu_li")
		.attr('class','works_sub_menu_li')

	d3.select(this)
		.attr('class','works_sub_menu_li selected_li')
}