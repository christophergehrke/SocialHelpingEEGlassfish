package web.beans;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import datamodel.entites.Customer;

import ejb.beans.CustomerEJB;

@ManagedBean (name = "customerBean")
@SessionScoped
public class CustomerBean {

	@EJB
	CustomerEJB customerEJB; 
	
	private List<Customer> customerList = new ArrayList<Customer>();

	public List<Customer> getCustomerList() {
		customerList = customerEJB.findAll();
		return customerList;
	}

	public void setCustomerList(List<Customer> customerList) {
		this.customerList = customerList;
	}
	
}
