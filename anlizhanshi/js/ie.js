
// Fixs for IE
/************** DOM READY --> Begin ***********************/

$(function() {
	var $link_last = $('ul.imagelist li:nth-child(3n), .alternate-blog .post-item:nth-child(2n), .pf_col_2 .post-item:nth-child(2n), .gl_col_3 .gallery-item:nth-child(3n)' );
	$link_last.css('margin-right','0');
});

/************** DOM READY --> END *************************/