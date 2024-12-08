function overviewTemplate(contacts, i, firstLetter, secondLetter){
    return `
    <div id="singleEntry${i}" class="singleEntry">
        <div class="userInitials" style="background-color: ${contacts[i].userColor};">${firstLetter}${secondLetter}</div>    
        <div>
            <div id="entryInfoName">${contacts[i].name}</div>
            <a id="entryInfoMail" href="mailto:${contacts[i].email}">${contacts[i].email}</a>
        </div>
    </div>`;
}