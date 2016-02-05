idtApp.controller('reportController', function($rootScope, $scope,reportService) {

	$rootScope.reports = [];

	loadRemoteData();

	$scope.setReportToShow = function(uuid){
		$rootScope.reportToShow = getReportById(uuid);
		console.log($rootScope.reportToShow);
	}

	function getReportById(id){
		var theReport;
		$rootScope.reports.filter(function(report){
			if(report.uuid === id){
				theReport = report;
				console.log(report);
			}
		});
		return theReport;
	}
	
	function loadRemoteData() {
		reportService.getReports().then(function(reports){

			applyRemoteData(reports);
		});
	}

	function applyRemoteData(newReports){
		$rootScope.reports = newReports;
	}


});