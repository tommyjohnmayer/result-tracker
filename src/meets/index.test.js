import React from "react";
import { shallow } from "enzyme";
import Meets from "./index";
import { MEET } from "../App";

describe("Meets.js tests", () => {
  let app;
  let props;
  const mockSelectEntity = jest.fn();
  const mockAddEntity = jest.fn();

  beforeEach(() => {
    props = {
      meets: [
        { id: "1", name: "King of the Mountain", date: "2019-01-21" },
        { id: "2", name: "Pine Mountain", date: "2019-02-01" }
      ],
      selected: {},
      selectEntity: mockSelectEntity,
      addEntity: mockAddEntity
    };
    app = shallow(<Meets {...props} />);
  });

  it("renders without crashing", () => {});

  it("calls selectEntity when first meet is clicked", () => {
    const firstMeet = app.find(".meet-selector").first();
    firstMeet.simulate("click");
    expect(mockSelectEntity).toHaveBeenCalledWith(MEET, "1");
  });

  it("does not call addEntity when meet name is empty", () => {
    const newMeetDate = app.find("FormControl.new-meet-date");
    newMeetDate.value = "2019-01-01";
    newMeetDate.simulate("change", {
      target: {
        value: "2019-01-01",
        name: "date",
        dataset: { object: "newEntity" }
      }
    });
    const newMeetForm = app.find("form.new-meet");
    newMeetForm.simulate("submit", { preventDefault: () => {} });
    expect(mockAddEntity).not.toHaveBeenCalled();
  });

  it("calls addEntity when form is filled and submitted", () => {
    const newMeetName = app.find("FormControl.new-meet-name");
    newMeetName.simulate("change", {
      target: {
        value: "New Meet Name",
        name: "name",
        dataset: { object: "newEntity" }
      }
    });
    const newMeetDate = app.find("FormControl.new-meet-date");
    newMeetDate.value = "2019-01-01";
    newMeetDate.simulate("change", {
      target: {
        value: "2019-01-01",
        name: "date",
        dataset: { object: "newEntity" }
      }
    });
    const newMeetForm = app.find("form.new-meet");
    newMeetForm.simulate("submit", { preventDefault: () => {} });
    expect(mockAddEntity).toHaveBeenCalledWith(MEET, {
      name: "New Meet Name",
      date: "2019-01-01"
    });
  });
});
