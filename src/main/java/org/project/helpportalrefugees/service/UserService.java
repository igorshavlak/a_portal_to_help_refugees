package org.project.helpportalrefugees.service;

import org.project.helpportalrefugees.DTO.RegistrationRequestDTO;
import org.project.helpportalrefugees.model.Refugee;
import org.project.helpportalrefugees.model.User;
import org.project.helpportalrefugees.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class UserService {

    UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public boolean safeOrUpdateUser(User user, Principal principal) {
        return userRepo.saveOrUpdateUserDetails(user, userRepo.getIdByUsername(principal.getName()));
    }

    public String getUsernameById(int id) {
        return userRepo.getUsernameById(id);
    }

    public User getUserDetails(Principal principal, String role) {
        return userRepo.getUserDetails(userRepo.getIdByUsername(principal.getName()), role);
    }

    public User getUserDetails(String username, String role) {
        return userRepo.getUserDetails(userRepo.getIdByUsername(username), role);
    }

    public int getIdByUsername(String username) {
        return userRepo.getIdByUsername(username);
    }

    public String getUserRoleByUsername(String username) {
        return userRepo.getGetUserRoleByUsername(username);
    }
    public void register(RegistrationRequestDTO dto) throws Exception {
        userRepo.registerUser(dto);

    }
}
