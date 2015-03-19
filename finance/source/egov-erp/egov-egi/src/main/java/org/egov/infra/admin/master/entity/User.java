package org.egov.infra.admin.master.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.egov.infra.persistence.entity.AbstractAuditable;
import org.egov.lib.rjbac.role.Role;
import org.egov.lib.rjbac.user.dao.UserDAO;

public class User extends AbstractAuditable<User, Long> {

    private static final long serialVersionUID = 2870751695666860068L;
    
    private String username;
    private String password;
    private String salutation;
    private String firstName;
    private String middleName;
    private String lastName;
    private Set<org.egov.lib.rjbac.role.Role> roles = new HashSet<org.egov.lib.rjbac.role.Role>();
    
    private Integer isActive;
    private Date dob;
    private Date pwdExpiryDate;

   

    public Date getPwdExpiryDate() {
        return pwdExpiryDate;
    }

    public void setPwdExpiryDate(final Date pwdExpiryDate) {
        this.pwdExpiryDate = pwdExpiryDate;
    }

     public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        final Date currDate = new Date();
        return getValidRolesOnDate(currDate);
    }

    public Set<Role> getValidRolesOnDate(final Date onDate) {
        return new UserDAO().getValidRoles(getId(), onDate);
    }

    public void setRoles(final Set roles) {
        this.roles = roles;
    }
     public void addRole(final Role role) {
        roles.add(role);
    }

    public String getSalutation() {
        return salutation;
    }

     public void setSalutation(final String salutation) {
        this.salutation = salutation;
    }
   
     public String getFirstName() {
        return firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

     public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(final String middleName) {
        this.middleName = middleName;
    }

    public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(final Integer isActive) {
        this.isActive = isActive;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public void removeRole(final Role role) {
        if (roles.contains(role))
            roles.remove(role);
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(final Date dob) {
        this.dob = dob;
    }
}
