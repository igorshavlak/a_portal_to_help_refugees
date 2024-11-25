package org.project.helpportalrefugees.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.DTO.HelpRequestDTO;
import org.project.helpportalrefugees.repository.ApplicationsRepo;
import org.project.helpportalrefugees.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    ApplicationsRepo applicationsRepo;
    UserRepo userRepo;
    private final ObjectMapper objectMapper;


    @Autowired
    public ApplicationService(ApplicationsRepo applicationsRepo, ObjectMapper objectMapper, UserRepo refugeeRepo) {
        this.applicationsRepo = applicationsRepo;
        this.objectMapper = objectMapper;
        this.userRepo = refugeeRepo;
    }

    public void save(HelpRequestDTO helpRequestDTO, Principal principal) throws IOException {
        MultipartFile file = helpRequestDTO.getSupportingDocument();
        byte[] fileData;
        if (file != null && !file.isEmpty()) {
           fileData = file.getBytes();
        } else {
            throw new IllegalArgumentException("Файл є обов'язковим");
        }
        Application application = new Application(userRepo.getIdByUsername(principal.getName()), helpRequestDTO.getType(), helpRequestDTO.getDescription(), helpRequestDTO.getAdditionalData(), "consideration",fileData);
        applicationsRepo.save(application);
    }

    public List<Application> getUserApplications(Principal principal) {
        if (principal instanceof Authentication) {
            Authentication authentication = (Authentication) principal;
            GrantedAuthority authority = authentication.getAuthorities().stream().findFirst().orElse(null);
            assert authority != null;
            if (authority.getAuthority().equals("ROLE_USER")) {
                int userId = userRepo.getIdByUsername(principal.getName());
                return applicationsRepo.getRefugeeApplications(userId);
            } else if (authority.getAuthority().equals("ROLE_VOLUNTEER")) {
                int volunteerId = userRepo.getIdByUsername(principal.getName());
                return applicationsRepo.getVolunteerApplications(volunteerId);
            }
        }
        throw new IllegalStateException("User has no valid role.");
    }

    public List<Application> getApplicationsByCategories(List<String> categories) {
        return applicationsRepo.getAllApplicationsByCategories(categories);
    }

    public void accept(int id, Principal principal) {
        applicationsRepo.acceptApplication(id, userRepo.getIdByUsername(principal.getName()));
    }
    public void approve(int id){
        applicationsRepo.approveApplication(id);
    }
    public void reject(int id){
        applicationsRepo.rejectApplication(id);
    }
    public Integer getRefugeeByApplicationId(int id){
       return applicationsRepo.getRefugeeByApplicationId(id);
    }

    public List<Application> getConsiderationApplications(){
        return applicationsRepo.getConsiderationApplications();
    }

}
