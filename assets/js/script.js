var lightbox;

$(document).ready(function() {
	$(document).foundation();
	
	lightbox = $('.lightbox');
	
	$(document).on("click", '.search label', function(){
		$(this).addClass('active');
	});

	$(document).on("change", '.check-all', function(){
		var is_checked = $(this).is(':checked');
		$(this).parents('table:first').find('.check').prop('checked', is_checked);
	});

	$(document).on('change', '.check', function(){
		$(this).parents('table:first').find('.check-all').prop('checked', false);
	});
});

function openLightbox(){
	lightbox.removeClass('hidden').addClass('fadeIn');
}

function closeLightbox(){
	lightbox.addClass('hidden');
}
