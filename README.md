## json server run command
   npx json-server --watch src/apiData/jsonServer/data.json --port 3006

## for starting client side 
   npm run dev

## for backened   
   /backened
   npm start

## for tabGroup
  /tabGroup   

## committed branch
   dev

## for star dyanamic layout
/starLayoutDynamic   

## for star fixed layout
/starLayoutFixed   





```text

├──backened                                # Backened - MVC model

├──src  
   ├── apiData                               # all data files
   │   └── jsonServer - all json data files
   │   
   ├── assets                                 # All images,video content
   |
   ├── components                          
   │   ├── components/svelte            
   │   │   └── homePage.svelte          # News Home page
   │   ├── components/star
   │   │   └── postmanHome.svelte       # Star Home Page  
   |   |
   │   ├── components/star
   │   │   └── /databaseView             # Database View 
   |
   │   ├── components/star
   │   │   └── /apiView                  # API View 
   |
   │   ├── components/star
   │   │   └── /logView                  # Log View 
   |   
   │   ├── components/event
   │   │   └── home.svelte       # Event Home Page    
   │   ├── components/magazine
   │   │   └── magazine.svelte       # Magazine page
   │   ├── components/videos
   │   │   └── video.svelte       # Videos page
   │   
   ├── layouts                       # Layouts
   |
   │   ├── eventLayout.astro         # layout for events
   │   │   
   │   ├── Layout.astro              # layout for news
   │   │                        
   │   ├── magazineLayout.astro              # layout for magazine
   │   │                        
   │   ├── starLayout.astro              # layout for star
   │   │                        
   │   ├── videoLayout.astro              # layout for videos
   │   │                        
   │   
   ├── pages                         # pages 
   |   | 
   │   ├── /contestDetails           # for contest details routing
   │   │   
   │   ├── /event                    # for event details routing
   │   │   
   │   ├── /internshipDetails        # for internship details routing
   │   │   
   │   ├── 404.astro                  # Error page
   │   │   
   │   ├── styleEvent.css                  # CSS for event page
   │   │   
   │   ├── styles.css                  # Star Page css
   │   │   
   │   ├── styleNews.css                  # News page css
   │   │       
   ├── tests                         # tests  
   | 
  
   
   
   
```
## Apidog Test Cases

### General Functionality

1. **Navigate to the page and verify main content is visible**
   - Ensure the main content is visible after navigating to the specified URL.

2. **Open and close the collection list**
   - Verify the collection list opens and closes correctly when interacting with the UI.

3. **Verify collection list options are functional**
   - Test functionality such as creating new collections, editing existing ones, and deleting collections.

4. **Create a new collection**
   - Add a new collection and verify it appears in the collection list.

5. **Edit an existing collection**
   - Modify an existing collection and ensure changes are reflected in the UI.

6. **Delete a collection**
   - Remove a collection and confirm it is no longer visible in the UI.

7. **Add and manage requests within a collection**
   - Test adding and managing requests within a collection, ensuring they display correctly.

8. **Add requests to tabs and implement all functionality**
   - Verify functionality such as adding new requests to tabs and ensuring all UI elements behave as expected.

### API Tab

9. **Verify all data is shown in UI for existing endpoint**
   - Ensure all details of an existing endpoint are correctly displayed in the API tab.

10. **Add assertions to verify content of the imported item**
    - Confirm imported items display correctly and contain expected content.

### Edit Tab

11. **Edit all details of an existing endpoint**
    - Test editing various details of an endpoint and saving changes.

12. **Edit responses of an existing endpoint**
    - Modify endpoint responses and verify changes in the UI.

13. **Add a new endpoint**
    - Create a new endpoint and ensure it appears correctly in the UI.

### Run Tab

14. **Run an existing endpoint using GET method**
    - Execute an endpoint using the GET method and verify expected results.

15. **Run an existing endpoint using POST method**
    - Test the endpoint functionality using the POST method and verify response.

16. **Run an existing endpoint using DELETE method**
    - Execute the endpoint using the DELETE method and confirm expected behavior.

### Mock Tab

17. **Mock responses for an endpoint**
    - Set up mock responses for an endpoint and verify they are correctly applied.

18. **Verify mock responses are correctly applied**
    - Ensure mock responses behave as expected when interacting with the UI.

### Adding New Endpoint

19. **Add a new tab in the APIs section**
    - Click on the APIs menu and add a new tab, verifying it appears correctly.

20. **Add a new endpoint with all details**
    - Create a new endpoint, filling out all required details, and ensure it is saved correctly.

### Saving Endpoint and Schemas

21. **Save endpoint and schemas with parent folder selection**
    - Save an endpoint and schemas, choosing the parent folder, and verify successful save.

22. **Save endpoint and schemas and move to details**
    - After saving, navigate to the details of the newly added endpoint.

### Environment Management

23. **Search and choose an environment from the list**
    - Search for an environment, select it from the list, and ensure it is applied correctly.

24. **Add a new environment**
    - Create a new environment, fill in details, and verify it appears in the environments list.

25. **Edit an existing environment**
    - Modify an existing environment’s details and confirm changes are saved successfully.

26. **Change global variables and parameters**
    - Update global variables and parameters within an environment and verify changes are applied.

### Additional Functionality

27. **Add a new folder in endpoints section**
    - Create a new folder within the endpoints section and confirm it is added correctly.

28. **Close all tabs using ellipsis icon**
    - Click on the ellipsis icon to close all open tabs and verify they are closed.

### Endpoint Details Navigation

29. **Navigate to details of newly added endpoint after saving**
    - After saving an endpoint, ensure navigation redirects to the details page for that endpoint.

### Modal Functionality

30. **Add, edit, and change environment details**
    - Test modal functionality for adding, editing, and changing environment details.

```
