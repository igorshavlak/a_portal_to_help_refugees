package org.project.helpportalrefugees.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.helpportalrefugees.model.Application;
import org.project.helpportalrefugees.model.HelpRequestDTO;
import org.project.helpportalrefugees.repository.ApplicationsRepo;
import org.project.helpportalrefugees.repository.RefugeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class ApplicationService {

    ApplicationsRepo applicationsRepo;
    RefugeeRepo refugeeRepo;
    private final ObjectMapper objectMapper;


    @Autowired
    public ApplicationService(ApplicationsRepo applicationsRepo, ObjectMapper objectMapper, RefugeeRepo refugeeRepo) {
        this.applicationsRepo = applicationsRepo;
        this.objectMapper = objectMapper;
        this.refugeeRepo = refugeeRepo;
    }
    public void save(HelpRequestDTO helpRequestDTO, Principal principal) throws JsonProcessingException {
        String additionalDataJson = objectMapper.writeValueAsString(helpRequestDTO.getAdditionalData());
        Application application = new Application(refugeeRepo.getIdByUsername(principal.getName()), helpRequestDTO.getType(), helpRequestDTO.getDescription(), additionalDataJson,"pending");
         applicationsRepo.save(application);
    }
    public List<Application> getUserApplications(Principal principal){
        return applicationsRepo.getUserApplications(refugeeRepo.getIdByUsername(principal.getName()));
    }
}
