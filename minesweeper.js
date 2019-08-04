function randomInt(n){
	var res=Math.floor(Math.random()*n);
	if(res==n) return n-1;
	return res;
}

function pick_n (total,n) {
	if(n>total) throw Error("n shouldn't be greater than total !")
	var res=[];
	var number=[];
	for(let i=0;i<total;i++){
		number.push(i);
	}
	for(let i =0;i<n;i++){
		var gen=randomInt(total-i);
		res.push(number[gen]);
		number.splice(gen,1);
	}
	return res;
}

function generate_pairs(width,height){
	var pairs=[]
	for(let i=0;i<width;i++){
		for(let j=0;j<height;j++)
			pairs.push([i,j]);
	}
	return pairs;
}

function choose_combinations (width,height,count) {
	// choose mines
	var pairs=generate_pairs(width,height);
	var res=[];
	picks=pick_n(pairs.length,count);
	for(let i=0;i<picks.length;i++){
		res.push(pairs[picks[i]]);
	}
	return res;
}

function is_point_valid(x,y,max_x,max_y) {
	// check
	if(x>=0 && x<max_x && y>=0 && y<max_y){
		return true;
	}
	return false;
}

function calculate_mine_number (grid,x,y) {
	if(grid[x][y]==-1) return -1;
	var count=0;
	if(is_point_valid(x-1,y-1,grid.length,grid[0].length) && grid[x-1][y-1]==-1 ){
		count++;
	}
	if(is_point_valid(x-1,y,grid.length,grid[0].length) && grid[x-1][y]==-1 ){
		count++;
	}
	if(is_point_valid(x-1,y+1,grid.length,grid[0].length) && grid[x-1][y+1]==-1 ){
		count++;
	}
	if(is_point_valid(x,y-1,grid.length,grid[0].length) && grid[x][y-1]==-1 ){
		count++;
	}
	if(is_point_valid(x,y+1,grid.length,grid[0].length) && grid[x][y+1]==-1 ){
		count++;
	}
	if(is_point_valid(x+1,y-1,grid.length,grid[0].length) && grid[x+1][y-1]==-1 ){
		count++;
	}
	if(is_point_valid(x+1,y,grid.length,grid[0].length) && grid[x+1][y]==-1 ){
		count++;
	}
	if(is_point_valid(x+1,y+1,grid.length,grid[0].length) && grid[x+1][y+1]==-1 ){
		count++;
	}
	return count;

}
function generate_grid (width,height,mine_number) {
	// initialize a grid...
	var grid=[]
	for(let i=0;i<width;i++){
		row=[]
		for(let j=0;j<height;j++){
			row.push(0)
		}
		grid.push(row);
	}
	mines=choose_combinations(width,height,mine_number);
	for(let i=0;i<mine_number;i++){
		let x=mines[i][0]
		let y=mines[i][1]
		grid[x][y]=-1;
	}
	//mark mines
	for(let i=0;i<width;i++){
		for(let j=0;j<height;j++){
			grid[i][j]=calculate_mine_number(grid,i,j);
		}
	}

	return grid;
}

function generate_map(grid) {
	// body...
	var tb=document.createElement("table");
	var body=document.createElement("tbody");
	body.setAttribute("id","mine_map");
	for(let i in grid){
		row=document.createElement("tr");
		for(let j in grid[i]){
			td=document.createElement("td");
			td.setAttribute("data",grid[i][j])
			row.appendChild(td);
		}
		body.appendChild(row)
	}
	tb.appendChild(body);
	return tb;
	
}

function get_td_coordinate (node) {
	// body...
	var coordinate=[];

	coordinate.push(node.parentNode.rowIndex);
	coordinate.push(node.cellIndex);
	return coordinate;
}

function get_td_by_coordinate (x,y) {
	// body...
	var table=document.getElementById("mine_map");
	return table.children[x].children[y];	
}

function play_music(sound_id){
	var sound=document.getElementById(sound_id);
	sound.play()
}

function flip(ele){
	$(ele).text($(ele).attr("data"));
	$(ele).attr("sweeped",1);
	$(ele).css("background-color","white");
	if($(ele).attr("data")==-1 ) {
		play_music("bomb");
	    alert("game over");
	}

}

function calculate_flag_number (td) {
	var coordinate=get_td_coordinate(td);
	var x=coordinate[0];
	var y=coordinate[1];
	var count=0;
	if(is_point_valid(x-1,y-1,grid.length,grid[0].length) && $(get_td_by_coordinate(x-1,y-1)).attr("marked")){
		count++;
	}
	if(is_point_valid(x-1,y,grid.length,grid[0].length) && $(get_td_by_coordinate(x-1,y)).attr("marked")){
		count++;
	}
	if(is_point_valid(x-1,y+1,grid.length,grid[0].length) && $(get_td_by_coordinate(x-1,y+1)).attr("marked")){
		count++;
	}
	if(is_point_valid(x,y-1,grid.length,grid[0].length) && $(get_td_by_coordinate(x,y-1)).attr("marked")){
		count++;
	}
	if(is_point_valid(x,y+1,grid.length,grid[0].length) && $(get_td_by_coordinate(x,y+1)).attr("marked")){
		count++;
	}
	if(is_point_valid(x+1,y-1,grid.length,grid[0].length) && $(get_td_by_coordinate(x+1,y-1)).attr("marked")){
		count++;
	}
	if(is_point_valid(x+1,y,grid.length,grid[0].length) && $(get_td_by_coordinate(x+1,y)).attr("marked")){
		count++;
	}
	if(is_point_valid(x+1,y+1,grid.length,grid[0].length) && $(get_td_by_coordinate(x+1,y+1)).attr("marked")){
		count++;
	}
	return count;

}

function flip_recursively(td){
	if($(td).attr("sweeped") || $(td).attr("marked")){
		return;
	}
	var number=calculate_flag_number(td);
	flip(td);
	if($(td).attr("data")!=String(number)) return;
	
	var coordinate=get_td_coordinate(td);
	var x=coordinate[0];
	var y=coordinate[1];
	var max_x=grid.length;
	var max_y=grid[0].length;
	if(is_point_valid(x-1,y-1,max_x,max_y)){
		let next=get_td_by_coordinate(x-1,y-1)
		flip_recursively(next);
	}
	if(is_point_valid(x-1,y-1,max_x,max_y)){
		let next=get_td_by_coordinate(x-1,y)
		flip_recursively(next);
	}
	if(is_point_valid(x-1,y+1,max_x,max_y)){
		let next=get_td_by_coordinate(x-1,y+1)
		flip_recursively(next);
	}
	if(is_point_valid(x,y-1,max_x,max_y)){
		let next=get_td_by_coordinate(x,y-1)
		flip_recursively(next);
	}
	if(is_point_valid(x,y+1,max_x,max_y)){
		let next=get_td_by_coordinate(x,y+1)
		flip_recursively(next);
	}
	if(is_point_valid(x+1,y-1,max_x,max_y)){
		let next=get_td_by_coordinate(x+1,y-1)
		flip_recursively(next);
	}
	if(is_point_valid(x+1,y,max_x,max_y)){
		let next=get_td_by_coordinate(x+1,y)
		flip_recursively(next);
	}
	if(is_point_valid(x+1,y+1,max_x,max_y)){
		let next=get_td_by_coordinate(x+1,y+1)
		flip_recursively(next);
	}
}

function sweep_mine (event) {
	let ele=event.currentTarget;
	//case 1:has flag
	if($(ele).attr("marked")) return;
	//case 2: no flag
	flip_recursively(ele);
}

function add_flag(ele){
	var flag='<div class="wrapper"><div class="tran"></div><div class="line"></div></div>'
	ele.innerHTML=flag;
	play_music("flag");
}



function clear_nearby (ele) {
	// body...
	var number=calculate_flag_number(ele);
	if($(ele).attr("data")!=String(number)) return;
	$(ele).removeAttr("sweeped");
	flip_recursively(ele);

}



window.onload=()=>{
	grid=generate_grid(16,30,99);
	tb=generate_map(grid);
	var container=document.getElementById('grid');
	container.appendChild(tb);
	$("td").click(sweep_mine);
	document.getElementById("grid").oncontextmenu = function(e){
        e.preventDefault();
    };

    $("td").mouseup((event)=>{
		let ele=event.currentTarget
		if(event.button==2){
			if($(ele).attr("sweeped")){
				clear_nearby(ele);
				return
			}
			if(!$(ele).attr("marked")){
				$(ele).attr("marked",1);
				add_flag(ele);
			}else{
				$(ele).removeAttr("marked");
				$(ele).html("");
				play_music("undo")
			}
			
		}
	
	})
}
