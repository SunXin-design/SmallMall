$(function(){
	var $mask = $('#mask'),
		$rightBar = $('#rightBar'),
		$page = $('html,body');
	$('#menuImg').on('click',function () {
	
		$page.addClass('offcanvas').css({
			width: $(window).width() + 'px',
			height: $(window).height() + 'px'
		});
		$mask.removeClass('hidden');
		setTimeout(function () {
			$mask.addClass('fadeIn');
			$('.right_bar_menu').css({
				backgroundColor: '#ffffff' //解决body=>overflow:hidden 后溢出部分没有背景的问题
			});
			$rightBar.css({
				transform: 'translateX(0)'
			});
		},10);
	});
	$('#leftBar').click(function () {
		$page.removeClass('offcanvas').css({
			width: 'auto',
			height: 'auto'
		});
		$rightBar.css({
			transform: 'translateX(4.4rem)'
		}).one('transitionend',function () {
			setTimeout(function () {
				$mask.removeClass('fadeIn').one('transitionend',function () {
					$(this).addClass('hidden');
				});
			},1);
		});
	});









})