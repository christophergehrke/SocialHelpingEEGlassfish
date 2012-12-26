package ejb.beans;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import datamodel.entites.Customer;

/**
 * Session Bean implementation class CustomerEJB
 */
@Stateless
@LocalBean
public class CustomerEJB {

	@PersistenceContext(unitName = "socialHelping")
    EntityManager em;

	   public List<Customer> customerList = new ArrayList<Customer>();
	
	   public List<Customer> findAll() {
	    	
	    	TypedQuery<Customer> query = em.createQuery("select c from Customer c", Customer.class);
	    	customerList = query.getResultList();
	    	return customerList;
	    	
	    }
	   
    /**
     * Default constructor. 
     */
    public CustomerEJB() {
        // TODO Auto-generated constructor stub
    }

}
