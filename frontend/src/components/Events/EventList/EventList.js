import React from "react";

import EventIem from "./EventItem/EventItem";
import "./EventList.css";

const eventsList = (props) => {
    const events = props.events.map((event) => {
        return (
            <EventIem
                key={event._id}
                eventId={event._id}
                title={event.title}
                price={event.price}
                date={event.date}
                userId={props.authUserId}
                creatorId={event.creator._id}
                onDetail={props.onViewDetail}
            />
        );
    });
    return <ul className="event__list">{events}</ul>;
};

export default eventsList;
