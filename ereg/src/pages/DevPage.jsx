import { useState } from "react"
import Button from "../components/Button"
import UserCard from "../components/UserCard"
import TextArea from "../components/textArea"
import ModuleCard from "../components/ModuleCard"
import InputField from "../components/InputField"
import InputSelect from "../components/InputSelect"
import FormWrapper from "../components/FormWrapper"
import { moduleName,moduleLenght,moduleDescription,firstName } from "../components/formsdasates";
import UserDatail from "../components/UserDetail"

export default function DevPage() {
 //modifica da fare,passare handlesubmit up,quindi  è nel genitore e poi verra passato down al wrapper
    const handleSubmit = (event) => {
    event.preventDefault()
    console.log(event.target.moduleName.value)
   console.log(event.target.moduleLenght.value)
    console.log(event.target.moduleDescription.value)
    
    //console.log(formIsValid)
    }

   //localStorage.clear()
const provedscriotipn="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel nulla ac eros gravida feugiat. Ut et ex sed dolor posuere euismod in sit amet arcu. Nulla facilisi. Cras mattis nisl vel accumsan tincidunt. Praesent aliquet purus leo, ac porta tellus blandit ut. Sed non erat vehicula, maximus nisi sed, imperdiet odio. Sed dapibus arcu at vestibulum ultrices. Vestibulum lacinia euismod enim at interdum. Sed gravida, sapien id ultrices pretium, quam nisl finibus tellus, mattis viverra enim magna sit amet massa. Integer nec sapien in augue ultrices aliquam imperdiet a orci. Aenean imperdiet ut ipsum eget rhoncus."
  return (
    <>
        <Button styleType="standard">Login</Button>
        <Button styleType="danger">cancellati </Button>
        <Button styleType="execute">aggiorna</Button>
        <Button styleType="standardBlack">aggiornaDue</Button>
        <UserCard firstName="Marcus" lastName="paparis"  userRole="Professor" imgSource="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/800px-Grosser_Panda.JPG"/>
        <UserCard  firstName="Marcus" lastName="paparis"  userRole="Professor" imgSource="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/800px-Grosser_Panda.JPG"/>
        <ModuleCard  moduleDescription={provedscriotipn} moduleTitle="Fondamenti di informatica" moduleProfessor="Mario Rossi"/>
        <FormWrapper confirmButton="Update" regetButton="Don't update" handleSubmit={handleSubmit} moduleName="moduleName" moduleLenght="moduleLenght" moduleDescription="moduleDescription">
          <InputField {...moduleName} />
          <InputField {...moduleLenght}/>
          <TextArea {...moduleDescription} />
        </FormWrapper>
        < UserDatail  userRoleName="coordinator" requestedUserId={150}/>
    </>
  );
}


/*
alternative  code
PASSING DOWN THE INPUT FIELDS AS ARRAY
     const password="password";
    const  email="email"
    <FormWrapper   presentFields={[password,email]}   presentFieldsInputs=[passwortInput,emailInput]>
*/
/**
 * <TextArea {...moduleDescription} />
    <InputField />
          <InputField />
          <InputField />
 */