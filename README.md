# Observe by CultureHouse

Observe is an urban planning application built for CultureHouse, a 501(c)(3) non-profit organization that improves livability in local communities by transforming underutilized spaces into vibrant social infrastructure. 

**Observe** allows CultureHouse volunteers and staff to record, edit, and view urban planning data that is specific to their data collection methods and visualization.

## Get Started
To get started, please ensure you have `node` and `pnpm` installed. `npm` also works fine although `pnpm` is recommended for package and lock file consistency. If you use an alternative package manager, be sure to add the lock file to your `.gitignore` file. 

To spin up the application:
```
cd client
pnpm install && pnpm run start
```

## Development

### Supabase
This project uses [Supabase](www.supabase.com) which you should have access to via the Making Biscuits Collective organization. Look for *Observe by Culturehouse*. Your `.env` file should live in your `/client` folder. 

Currently, there are three tables in Supabase, each representing a major data structure for this application. Essentially, users can create/edit projects, events, and instances.


#### Projects
A project may have many events associated to it. The project table has the following columns:

* **id**: the unique project ID, assigned automatically
* **created_at**: timestamp when the project was created
* **title**: the title of the project
* **short_description**: a short preview description of the project
* **description**: longer description potentially with rich text of the project
* **status**: the status of the project, "Current", "Future" or "Archived"
* **start_date**: the start date in date format for the project
* **end_date**: the end date in date format for the project
* **image_path**: the path name for the uploaded header/cover image

#### Events
Events occur as part of a project. A single project may have multiple events associated with it but an event may only be tied to a single project. Every event must have a map associated with it. 

* **id**: the unique event ID, assigned automatically
* **created_at**: timestamp when the event was created
* **title**: the title of the event
* **map_path**: the path name for the uploaded map image
* **date**: the date in date format for the event
* **location**: a string representing the location
* **notes**: miscellaneous info and notes about this event
* **project**: foreign key ID tied to the associated project (this will be the value of the **id** field of the associated project)

#### Instances (Observations)
Instances occur as part of an event and may also be referred to internally as an *observation*. There are two types of observations in this MVP which we will refer to as **staying observations** and **moving observations**. 

* **id**: the unique instance ID, assigned automatically
* **created_at**: timestamp when the event was created
* **observer_name**: the name of the volunteer who recorded this data
* **time**: the time of observation
* **date**: the date in date format for the observation
* **temperature**: a number representing the temperature in fahrenheit 
* **weather**: enum representing the weather during the observation
* **type**: enum for type of observation, i.e. **STAY** or **MOVE**
* **map_data**: a string representing either map coordinates for staying data or an array of coordinates for moving data
* **event**: foreign key ID tied to the associated event (this will be the value of the **id** field of the associated event)

