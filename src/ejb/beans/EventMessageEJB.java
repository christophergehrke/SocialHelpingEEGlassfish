package ejb.beans;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import datamodel.entites.EventMessage;

/**
 * Session Bean implementation class CustomerEJB
 */
@Stateless
@LocalBean
public class EventMessageEJB {

	@PersistenceContext(unitName = "socialHelping")
    EntityManager em;

	   public List<EventMessage> eventMessageList = new ArrayList<EventMessage>();
	
	   public List<EventMessage> findAll() {
	    	
	    	TypedQuery<EventMessage> query = em.createQuery("select c from EventMessage c", EventMessage.class);
	    	eventMessageList = query.getResultList();
	    	return eventMessageList;
	    	
	    }
	   
    /**
     * Default constructor. 
     */
    public EventMessageEJB() {
        // TODO Auto-generated constructor stub
    }

}
