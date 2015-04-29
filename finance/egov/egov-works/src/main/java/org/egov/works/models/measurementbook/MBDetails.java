package org.egov.works.models.measurementbook;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.infra.persistence.validator.annotation.GreaterThan;
import org.egov.infra.persistence.validator.annotation.OptionalPattern;
import org.egov.infra.persistence.validator.annotation.Required;
import org.egov.infra.validation.regex.Constants;
import org.egov.infstr.ValidationError;
import org.egov.infstr.models.BaseModel;
import org.egov.works.models.workorder.WorkOrderActivity;
import org.hibernate.validator.constraints.Length;



public class MBDetails extends BaseModel {
	
	@Required(message = "mbdetails.mbheader.null")
	private MBHeader mbHeader;
	@Required(message = "mbdetails.activity.null")
	private WorkOrderActivity workOrderActivity;
	@GreaterThan(value=0,message="mbdetails.quantity.non.negative")
	private double quantity;
	@Length(max = 400, message = "mbdetails.remark.length")
	private String remark;
	
	//------------------------Fields for calculations---------------------
	private double prevCumlvQuantity;
	private double currCumlvQuantity;
	private double amtForCurrQuantity;
	private double cumlvAmtForCurrCumlvQuantity;
	private Date mbdetailsDate;
	@OptionalPattern(regex=Constants.ALPHANUMERIC_WITHSLASHES,message="mbdetails.ordernumber")
	private String OrderNumber;
	//-------------------------------------------------------------------
	private double totalEstQuantity;		//Added for RE
	private double amount = 0.0; 		
	
	public List<ValidationError> validate() {
		List<ValidationError> validationErrors = new ArrayList<ValidationError>();
		if (mbHeader != null
				&& (mbHeader.getId() == null || mbHeader.getId() == 0 || mbHeader.getId() == -1)) {
			validationErrors.add(new ValidationError("mbHeader", "mbdetails.mbheader.null"));
		} 
		if (workOrderActivity != null
				&& (workOrderActivity.getId() == null
						|| workOrderActivity.getId() == 0 || workOrderActivity.getId() == -1)) {
			validationErrors.add(new ValidationError("workOrderActivity", "mbdetails.activity.null"));
		} 
		return validationErrors;
	}
	
	public void setMbHeader(MBHeader mbHeader) {
		this.mbHeader = mbHeader;
	}
	
	public MBHeader getMbHeader() {
		return mbHeader;
	}
	
	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}
	public double getQuantity() {
		return quantity;
	}

	public WorkOrderActivity getWorkOrderActivity() {
		return workOrderActivity;
	}

	public void setWorkOrderActivity(WorkOrderActivity workOrderActivity) {
		this.workOrderActivity = workOrderActivity;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**
	 * Get Cumulative quantity upto pervious entry 
	 */
	public double getPrevCumlvQuantity() {
		return prevCumlvQuantity;
	}
	
	public void setPrevCumlvQuantity(double prevCumlvQuantity) {
		this.prevCumlvQuantity = prevCumlvQuantity;
	}

	/**
	 * Get Cumulative quantity including current entry
	 */
	public double getCurrCumlvQuantity() {
		return currCumlvQuantity;
	}

	public void setCurrCumlvQuantity(double currCumlvQuantity) {
		this.currCumlvQuantity = currCumlvQuantity;
	}

	/**
	 * Get Amount for current entry 
	 */
	public double getAmtForCurrQuantity() {
		return amtForCurrQuantity;
	}

	public void setAmtForCurrQuantity(double amtForCurrQuantity) {
		this.amtForCurrQuantity = amtForCurrQuantity;
	}

	/**
	 * Get Cumulative amount including current entry
	 */
	public double getCumlvAmtForCurrCumlvQuantity() {
		return cumlvAmtForCurrCumlvQuantity;
	}

	public void setCumlvAmtForCurrCumlvQuantity(double cumlvAmtForCurrCumlvQuantity) {
		this.cumlvAmtForCurrCumlvQuantity = cumlvAmtForCurrCumlvQuantity;
	}

	public Date getMbdetailsDate() {
		return mbdetailsDate;
	}

	public void setMbdetailsDate(Date mbdetailsDate) {
		this.mbdetailsDate = mbdetailsDate;
	}

	public String getOrderNumber() {
		return OrderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		OrderNumber = orderNumber;
	}

	public double getTotalEstQuantity() {
		return totalEstQuantity;
	}

	public void setTotalEstQuantity(double totalEstQuantity) {
		this.totalEstQuantity = totalEstQuantity;
	}
	
	public double getAmount() {
		if(workOrderActivity.getActivity().getNonSor()==null){
			amount = workOrderActivity.getApprovedRate()*quantity*workOrderActivity.getConversionFactor();
		}
		else{
			amount=workOrderActivity.getApprovedRate()*quantity;
		}
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}
}
