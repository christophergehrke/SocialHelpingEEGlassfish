/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package de.persistservice;

import de.entities.User;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

/**
 *
 * @author ivan
 * 
 * Diese Klasse ist das SessionBean zum sprechen mit der DB
 */
@Stateless
public class UserService {
    
    @PersistenceContext
    private EntityManager em;
    
    public void createUser (User user){
        em.persist(user);
    }
    
    public List<User> getAll(){
        TypedQuery<User> query = em.createQuery("select u from USER U", User.class);
        return query.getResultList();
    }
}
