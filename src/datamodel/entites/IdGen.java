package datamodel.entites;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the id_gen database table.
 * 
 */
@Entity
@Table(name="id_gen")
public class IdGen implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="gen_key")
	private String genKey;

	//bi-directional many-to-one association to EventMessage
	@OneToMany(mappedBy="idGen")
	private List<EventMessage> eventMessages;

	public IdGen() {
	}

	public String getGenKey() {
		return this.genKey;
	}

	public void setGenKey(String genKey) {
		this.genKey = genKey;
	}

	public List<EventMessage> getEventMessages() {
		return this.eventMessages;
	}

	public void setEventMessages(List<EventMessage> eventMessages) {
		this.eventMessages = eventMessages;
	}

}