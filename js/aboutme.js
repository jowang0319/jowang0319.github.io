console.log('about me')

// if (screen_width <= 500){
//       	var margin = {top: 110, right: 25, bottom: 0, left: 80},
//      		width = parseInt(d3.select("div#about_me_session").style("width"))/1 - margin.left - margin.right,
//       		height = 230 - margin.top - margin.bottom;
// 		    
// 	}else if (screen_width<=700){
// 		var margin = {top: 110, right: 0, bottom: 0, left: 80},
//      		width = parseInt(d3.select("div#about_me_session").style("width"))/1.1 - margin.left - margin.right,
//       		height = 230 - margin.top - margin.bottom;
// 	}
// 	else{
		var margin = {top: 70, right: 10, bottom: 10, left: 10},
     		width = parseInt(d3.select("div#about_me_session").style("width"))/1 - margin.left - margin.right,
      		height = 260 - margin.top - margin.bottom;
	// }

    d3.queue()
    	.defer(d3.csv,"data/aboutme.csv")
    	.defer(d3.csv,"data/highlight_year.csv")
    	.await(ready)

    function ready(error, data, highlight_data){
    	// console.log(data)

		var about_me_div = d3.select("#about_me_session");

		about_me_div.select("svg")
			.remove()

		var about_me_svg = about_me_div
			.append("svg")
	        .attr("height", height + margin.top + margin.bottom)
	        .attr("width", width + margin.left + margin.right)
	        .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// 
// 	    var x_min_y = d3.min(data,function(d){
// 	    	return d.Year
// 	    })
// 
// 	    var x_min_ye = d3.min(data,function(d){
// 	    	return d.Year_End
// 	    })
// 
// 	    var x_max_y = d3.max(data,function(d){
// 	    	return d.Year
// 	    })
// 
// 	    var x_max_ye = d3.max(data,function(d){
// 	    	return d.Year_End
// 	    })
// 
// 	    var x_min = d3.min([x_min_y,x_min_ye])
// 
// 	    var x_max = d3.max([x_max_y,x_max_ye])
// 	    console.log(x_min,x_max)

	    var xScale = d3.scaleLinear()
		    .range([0,width])
		    .domain([0,29]);

		var xScaleAxis = d3.scaleLinear()
		    .range([0,width])
		    .domain([1992,2021]);

		var y_range = data.map(function(d){
			return d.Category
		})
		// console.log(y_range)

		var yScale = d3.scaleBand()
		    .range([0,height])
		    .padding(0.3)
		    .domain(y_range);

		var bars = about_me_svg.selectAll(".cat_bars")
			.data(data)
			.enter().append('rect')
			.attr('class','cat_bars')
			.attr('id',function(d){
				return d.Category
			})
			.attr('x',function(d){
				return xScale(d.Age)
			})
			.attr('width',function(d){
				// console.log(d.Year_End - d.Year)
				return xScale(d.Age_End - d.Age)
			})
			.attr('y',function(d){
				return yScale(d.Category)
			})
			.attr('height',yScale.bandwidth())
			.attr('fill',function(d){
				return d.Color
			})
			.attr('opacity',function(d){
				if (d.Category == 'Data_Viz'){
					return 1
				}else{
					return 0.4
				}
			})
			.on('mouseover',mouseoverAboutMe)

		// about_me_svg.append("g")
	 //      // .attr("transform", "translate(0," + height + ")")
	 //      .call(d3.axisTop(xScaleAxis).ticks(3))
	 //      .attr('class','axis about_me_axis');

	    var lineGenerator = d3.line()
			.curve(d3.curveCardinal);

		draw_curve('Data_Viz')

		function draw_curve(sel_cat){
			var this_data = data.filter(function(d){
				return d.Category == sel_cat
			})[0]

			// console.log(this_data)

			o_x = xScale(this_data.Age)
			o_y = yScale(sel_cat)+yScale.bandwidth()/2

			var points = [
				[o_x,o_y],
				[o_x-13,o_y+3],
				[o_x-26,o_y+3]
			]

			// console.log(points)

			var pathData = lineGenerator(points);
			// console.log(pathData)

			d3.selectAll('.indicator')
				.remove()

			d3.selectAll('.indicator_label')
				.remove()

			var indicator = about_me_svg
				.append('path')
				.attr('d',pathData)
				.attr('class','indicator')
				.attr("fill",'none')
				.attr("stroke",'darkgray')

			var label = about_me_svg
				.append('text')
				.attr('x',o_x-28)
				.attr('y',o_y+3)
				.attr('class','indicator_label')
				.text(this_data.Full_Name)
				.attr('text-anchor','end')
				.attr('alignment-baseline','middle')
				.attr('fill','dimgray')

			d3.select("#about_me_hover")
				.html(this_data.Description)

		}	// end of function draw curve

		function mouseoverAboutMe(d){
			draw_curve(d.Category)

			d3.selectAll('.cat_bars')
				.attr('opacity',0.4)

			d3.selectAll("#"+d.Category)
				.attr('opacity',1)

		}	// end of mouseover about me

		// console.log(highlight_data)

		// draw year highlight
		about_me_svg.selectAll('.year_highlight')
			.data(highlight_data)
			.enter().append('line')
			.attr('x1',function(d){
				return xScale(d.age)
			})
			.attr('x2',function(d){
				return xScale(d.age)
			})
			.attr('y1',-10)
			.attr('y2',height)
			.attr('class','year_highlight')
			.attr('fill','none')
			.attr('stroke',"lightgrey")

		var icon_list = {
			"born":"\uf77c",
			"work":"\uf0b1",
			"US":"\uf072",
			"first":"\uf1ea",
			"adult":"\uf02d",
			"this":"\uf133"
		}

		about_me_svg.selectAll('.icon_highlight')
			.data(highlight_data)
			.enter().append('text')
			// .attr('font-family','Font Awesome 5 Free')
			.attr('class','icon_highlight fa')
			.attr('x',function(d){
				return xScale(d.age)
			})
			.attr('y',-30)
			.attr('font-size','16px')
			.text(function(d){
				return icon_list[d.case]
			})
			.attr('text-anchor','middle')
			.attr('fill','darkgray')
			.attr('id',function(d){
				return d.case+"_icon"
			})

		about_me_svg.selectAll('.year_highlight_label')
			.data(highlight_data)
			.enter().append('text')
			// .attr('font-family','Font Awesome 5 Free')
			.attr('x',function(d){
				return xScale(d.age)
			})
			.attr('font-size','10px')
			.attr('y',-15)
			.text(function(d){
				return d.year
			})
			.attr('text-anchor','middle')
			.attr('fill','darkgray')
			.attr('class','year_highlight_label')
			.attr('id',function(d){
				return d.case+"_year"
			})

		if (parseInt(d3.select("div#about_me_session").style("width")) >= 500){
			about_me_svg.selectAll('.year_highlight_detail')
				.data(highlight_data)
				.enter().append('text')
				// .attr('font-family','Font Awesome 5 Free')
				.attr('x',function(d){
					return xScale(d.age)
				})
				.attr('font-size','10px')
				.attr('y',-50)
				.text(function(d){
					return d.detail
				})
				.attr('text-anchor','middle')
				.attr('fill','darkgray')
				.attr('class','year_highlight_label')
				.attr('id',function(d){
					return d.case+"_"
				})
		}
		
    }// end of ready function

// d3.csv("data/aboutme.csv")
// 	.get(function(error,data){
// 		
// 	}) // end of about me csv
