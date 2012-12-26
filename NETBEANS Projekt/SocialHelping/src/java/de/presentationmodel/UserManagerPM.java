/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package de.presentationmodel;

import de.entities.User;
import de.persistservice.UserService;
import java.util.List;
import javax.ejb.EJB;
import javax.inject.Inject;

/**
 *
 * @author ivan
 */
@javax.faces.bean.ManagedBean
public class UserManagerPM {
    
    @Inject
    User user;
    
    @EJB
    private UserService service;
    
    public void saveUser(){
        service.createUser(user);
    }
    
    public List<User> getUserList(){
        return service.getAll();
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

   
    
    
}
