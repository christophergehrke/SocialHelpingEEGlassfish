package web.beans;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

import org.primefaces.event.SelectEvent;
//import org.primefaces.event.UnselectEvent;

import datamodel.entites.EventMessage;
import ejb.beans.EventMessageEJB;

@ManagedBean(name = "eventMessageBean")
@SessionScoped
public class EventMessageBean {

	@EJB
	EventMessageEJB eventMessageEJB;

	EventMessage selectedEventMessage;

	public EventMessage getSelectedEventMessage() {
		return selectedEventMessage;
	}

	public void setSelectedEventMessage(EventMessage selectedEventMessage) {
		this.selectedEventMessage = selectedEventMessage;
	}

	private List<EventMessage> eventMessageList = new ArrayList<EventMessage>();

	public List<EventMessage> getEventMessageList() {
		eventMessageList = eventMessageEJB.findAll();
		return eventMessageList;
	}

	public void setEventMessageList(List<EventMessage> customerList) {
		this.eventMessageList = customerList;
	}

	public void onRowSelect(SelectEvent event) {
		FacesMessage msg = new FacesMessage("Car Selected",
				((EventMessage) event.getObject()).getTitel());

		FacesContext.getCurrentInstance().addMessage(null, msg);
	}

//	public void onRowUnselect(UnselectEvent event) {
//		FacesMessage msg = new FacesMessage("Car Unselected",
//				((EventMessage) event.getObject()).getTitel());
//
//		FacesContext.getCurrentInstance().addMessage(null, msg);
//	}
}
