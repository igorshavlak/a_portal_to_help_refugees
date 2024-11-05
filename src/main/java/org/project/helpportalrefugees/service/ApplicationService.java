package org.project.helpportalrefugees.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.model.HelpRequestDTO;
import org.project.helpportalrefugees.model.Volunteer;
import org.project.helpportalrefugees.repository.ApplicationsRepo;
import org.project.helpportalrefugees.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

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

    public void save(HelpRequestDTO helpRequestDTO, Principal principal) throws JsonProcessingException {
        String additionalDataJson = objectMapper.writeValueAsString(helpRequestDTO.getAdditionalData());
        Application application = new Application(userRepo.getIdByUsername(principal.getName()), helpRequestDTO.getType(), helpRequestDTO.getDescription(), additionalDataJson, "pending");
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

}
