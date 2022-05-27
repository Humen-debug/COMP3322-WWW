var conn = new Mongo();

var db = conn.getDB("assignment1-db");

var users_name = ["Amy", "Bob"];
var users_password = ["123456","456789"];
var users_icon = ["images/user.jpg","images/user.jpg"];

db.userList.remove({});

for (let i = 0; i < users_name.length; i++){
    db.userList.insert(
        {
            'name': users_name[i],
            'password': users_password[i],
            'icon': users_icon[i],
        }
    )
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var news_headlines =
[
    "Jason Day signs with Bridgestone Golf",
        "Ukrainians Push Back as Russian Troops Pummel Cities",
        "Brain Implant Allows Fully Paralyzed Patient to Communicate",
        "6 Oklahoma High School Students Killed in Crash",
        "‘Music Man’ Sets Box Office Record for a Reopened Broadway",
        "No Survivors Found in China Eastern Crash, Officials Say",
        "‘OK Doomer’ and the Climate Advocates Who Say It’s Not Too Late",
        "On the Scene in Poland",
        "Boeing Faces New Upheaval After Crash of Chinese Airliner",
        "High Death Rate in Hong Kong Shows Importance of Vaccinating the Elderly",
        "What Questions Do You Have About Climate Change?",
        "The Man in the Oliver Green Tee",
        "Hong Kong to Lift Bans on Flights",
        "The Grimmest Dilemma",
        "Spring Returns"
    
];
var news_contents =
[
    "Twelve-time PGA TOUR winner Jason Day has signed with Bridgestone Golf to use its golf ball.",
        "Ukraine pressed to thwart the invasion on multiple fronts, and Moscow expanded its recent draconian crackdown on dissent.",
        "Letter by painstaking letter, a man in a completely locked-in state was able to formulate words and sentences using only his thoughts.",
        "The small passenger vehicle the girls were in collided with a semi-truck in Tishomingo, Okla., a rural city about 120 miles southeast of Oklahoma City.",
        "The Hugh Jackman-led revival has 76 trombones, 110 cornets, and took in $3.5 million in ticket sales last week, more than any show since the pandemic began.",
        "Workers recovered identity cards, cellphones and purses from the crash site. But the plane’s steep plunge suggested there was a “minuscule” chance of any survivors, an expert said.",
        "A growing chorus of young people is focusing on climate solutions. “‘It’s too late’ means ‘I don’t have to do anything, and the responsibility is off me.’”",
        "A sprawling expo center in the Polish capital has given some 25,000 refugees a safe place to recharge before journeying on.",
        "No fault has been found, but the company, which has been trying to overcome a recent legacy of design and production troubles, is likely to get scrutinized.",
        "Covid has surged in a number of Asian countries that had onc eheld the virus at bay. Vaccination levels have largely determined how deadly those wave would be.",
        "Wondering about a word, a scientific phenomenon, a policy or something else? We're here to help.",
        "How President Volodymyr Zelensky of Ukraine transformed of Ukarine transformed the meaning of a piece of cotton.",
        "Carrie Lam, the chief executive of Hong Kong, said the city would ends it ban on flights from nine countries and relax other coronavirus measures as new cases decline.",
        "The Biden administration is facing an old Cold War dilemma: Be weak or risk a world war.",
        "Some suggestions for how to spend the first week of the season."

];
var news_times =
    [
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date()),
        randomDate(new Date(2022, 0,1), new Date())
    ];

var news_comments =
[
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];

    db.newsList.remove({});

for (let i = 0; i < news_headlines.length; i++){
    db.newsList.insert({
        'headline': news_headlines[i],
        'content': news_contents[i],
        'time': news_times[i],
        'comments':news_comments[i],
    });
}