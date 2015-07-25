/*#-------------------------------------------------------------------------------
	# eGov suite of products aim to improve the internal efficiency,transparency, 
	#    accountability and the service delivery of the government  organizations.
	# 
	#     Copyright (C) <2015>  eGovernments Foundation
	# 
	#     The updated version of eGov suite of products as by eGovernments Foundation 
	#     is available at http://www.egovernments.org
	# 
	#     This program is free software: you can redistribute it and/or modify
	#     it under the terms of the GNU General Public License as published by
	#     the Free Software Foundation, either version 3 of the License, or
	#     any later version.
	# 
	#     This program is distributed in the hope that it will be useful,
	#     but WITHOUT ANY WARRANTY; without even the implied warranty of
	#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	#     GNU General Public License for more details.
	# 
	#     You should have received a copy of the GNU General Public License
	#     along with this program. If not, see http://www.gnu.org/licenses/ or 
	#     http://www.gnu.org/licenses/gpl.html .
	# 
	#     In addition to the terms of the GPL license to be adhered to in using this
	#     program, the following additional terms are to be complied with:
	# 
	# 	1) All versions of this program, verbatim or modified must carry this 
	# 	   Legal Notice.
	# 
	# 	2) Any misrepresentation of the origin of the material is prohibited. It 
	# 	   is required that all modified versions of this material be marked in 
	# 	   reasonable ways as different from the original version.
	# 
	# 	3) This license does not grant any rights to any user of the program 
	# 	   with regards to rights under trademark law for use of the trade names 
	# 	   or trademarks of eGovernments Foundation.
	# 
	#   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
#-------------------------------------------------------------------------------*/

jQuery(document)
		.ready(
				function($) {

					compTypereportContainer = $("#compTypeReport-table");

					$('#report-backbutton').hide(); 
					
					$('#backButton').click(function(e) {
						//callajaxdatatableForCompTypeReport();
					});

					$('#complaintTypeReportSearch').click(function(e) {
						console.log('calling inside ajax');
						callajaxdatatableForCompTypeReport();
					});

					function callajaxdatatableForCompTypeReport() {
						console.log('calling inside ajaxssssss');
						var startDate = "";
						var endDate = "";
						var complTyp = "";
						var when_dateVal = "";
						startDate = $('#start_date').val();
						endDate = $('#end_date').val();

						when_dateVal = $('#when_date').val();
						complTyp = $('#complaintTypeId').val();
						if ($('#start_date').val() == "")
							startDate = "";

						if ($('#end_date').val() == "")
							endDate = "";

						$('.report-section').removeClass('display-hide');
						$('#report-footer').show();
						$('#report-backbutton').hide();

						compTypereportContainer
								.dataTable({
									ajax : {
										url : "/pgr/report/complaintTypeReport/resultList-update",
										data : {
											fromDate : startDate,
											toDate : endDate,
											complaintType : complTyp,
											complaintDateType : when_dateVal
										}
									},
									"sPaginationType" : "bootstrap",
									"autoWidth" : false,
									"bDestroy" : true,
									"sDom" : "<'row'<'col-xs-12 hidden col-right'f>r>t<'row'<'col-md-3 col-xs-12'i><'col-md-3 col-xs-6 col-right'l><'col-xs-12 col-md-3 col-right'<'export-data'T>><'col-md-3 col-xs-6 text-right'p>>",
									"aLengthMenu" : [ [ 10, 25, 50, -1 ],
											[ 10, 25, 50, "All" ] ],
									"oTableTools" : {
										"sSwfPath" : "../../../../../../egi/resources/global/swf/copy_csv_xls_pdf.swf",
										"aButtons" : [ "xls", "pdf", "print" ]
									},
									columns : [
											{
												"data" : "name",
												"render" : function(data, type,
														row) {
													return '<a href="javascript:void(0);" onclick="setHiddenValueByLink(this,\'Boundarywise\');" data-hiddenele="boundary" data-eleval="'
															+ data
															+ '">'
															+ data + '</a>';
												},
												"sTitle" : "Complaint Type Name"
											}, {
												"mData" : "registered",
												"sTitle" : "Registered"

											}, {
												"data" : "inprocess",
												"sTitle" : "Inprocess"
											}, {
												"data" : "completed",
												"sTitle" : "Completed"
											}, {
												"data" : "rejected",
												"sTitle" : "Rejected"

											}, {
												"data" : "total",
												"sTitle" : "Total"

											} ],
									"footerCallback" : function(row, data,
											start, end, display) {
										var api = this.api(), data;
										if (data.length == 0) {
											$('#report-footer').hide();
										} else {
											$('#report-footer').show();
										}
										if (data.length > 0) {
											updateTotalFooter(1, api);
											updateTotalFooter(2, api);
											updateTotalFooter(3, api);
											updateTotalFooter(4, api);
											updateTotalFooter(5, api);

										}
									},
									"aoColumnDefs" : [ {
										"aTargets" : [ 1, 2, 3, 4, 5 ],
										"mRender" : function(data, type, full) {
											return formatNumberInr(data);
										}
									} ]

								});
					}
					var complaintType = new Bloodhound(
							{
								datumTokenizer : function(datum) {
									return Bloodhound.tokenizers
											.whitespace(datum.value);
								},
								queryTokenizer : Bloodhound.tokenizers.whitespace,
								remote : {
									url : '/pgr/complaint/pgrreport/complaintTypes?complaintTypeName=%QUERY',
									filter : function(data) {
										// Map the remote source JSON array to a
										// JavaScript object array
										return $.map(data, function(ct) {
											return {
												name : ct.name,
												value : ct.id
											};
										});
									}
								}
							});

					complaintType.initialize();

					var com_type_typeahead = $('#com_type').typeahead({
						hint : false,
						highlight : false,
						minLength : 3
					}, {
						displayKey : 'name',
						source : complaintType.ttAdapter()
					});
					typeaheadWithEventsHandling(com_type_typeahead,
							'#complaintTypeId');

				});

function updateTotalFooter(colidx, api) {
	// Remove the formatting to get integer data for summation
	var intVal = function(i) {
		return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1
				: typeof i === 'number' ? i : 0;
	};

	// Total over all pages
	total = api.column(colidx).data().reduce(function(a, b) {
		return intVal(a) + intVal(b);
	});

	// Total over this page
	pageTotal = api.column(colidx, {
		page : 'current'
	}).data().reduce(function(a, b) {
		return intVal(a) + intVal(b);
	}, 0);

	// Update footer
	$(api.column(colidx).footer()).html(
			'<b>' + formatNumberInr(pageTotal) + ' (' + formatNumberInr(total)
					+ ')</b>');
}

//inr formatting number
function formatNumberInr(x) {
	if (x) {
		x = x.toString();
		var afterPoint = '';
		if (x.indexOf('.') > 0)
			afterPoint = x.substring(x.indexOf('.'), x.length);
		x = Math.floor(x);
		x = x.toString();
		var lastThree = x.substring(x.length - 3);
		var otherNumbers = x.substring(0, x.length - 3);
		if (otherNumbers != '')
			lastThree = ',' + lastThree;
		var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
				+ lastThree + afterPoint;
		return res;
	}
	return x;
}

function showChangeDropdown(dropdown) {
	$('.drophide').hide();
	var showele = $(dropdown).find("option:selected").data('show');
	if (showele) {
		$(showele).show();
	} else {
		$('#start_date').val("");
		$('#end_date').val("");

	}
}
function setHiddenValueByLink(obj, paaram) {

}
