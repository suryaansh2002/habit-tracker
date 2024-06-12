const Habit = require("../models/habit");
const moment = require("moment");
exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getHabitsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserStartDate = async (req, res) => {
  const { userId } = req.query;
  try {
    const habits = await Habit.find({ userId });
    let startDate = ''
    if(habits.length){
      startDate = moment(habits[0].startDate)
      habits.map((item)=>{
        if(moment(item['startDate']).isBefore(startDate)){
          startDate=moment(item['startDate'])
        }
      })
    }
    if(startDate==''){
        res.status(200).json({startDate});
      return
    }
    startDate = startDate.format('YYYY-MM-DD')
    res.status(200).json({startDate});
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getHabitById = async (req, res) => {
  const { id } = req.params;

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateHabitById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const habit = await Habit.findByIdAndUpdate(id, updateData, { new: true });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

function calculateDaysDifference(date1, date2) {
  var momentDate1 = moment(date1, "YYYY-MM-DD");
  var momentDate2 = moment(date2, "YYYY-MM-DD");

  var differenceInDays = momentDate2.diff(momentDate1, "days");
  return differenceInDays;
}

function countDoneDaysInRange(startDate, endDate, doneDays) {
  var momentStartDate = moment(startDate, "YYYY-MM-DD");
  var momentEndDate = moment(endDate, "YYYY-MM-DD");

  // Filter the doneDays array to include only dates within the range
  var count = doneDays.filter(function (day) {
    var momentDay = moment(day, "YYYY-MM-DD");
    return (
      momentDay.isSameOrAfter(momentStartDate) &&
      momentDay.isSameOrBefore(momentEndDate)
    );
  }).length;

  return count;
}

exports.getFilteredHabits = async (req, res) => {
  console.log(req.query);
  const { startDate, endDate, userId } = req.query;
  let habits = await Habit.find({ userId });
  habits= habits.map((habit)=>
  {
    if(habit.endDate.length){
      return {...habit['_doc']};
    }
    else{
      return {
        ...habit['_doc'],
        endDate:"9999-12-31",
      }
    }
  }
  )

  let filteredHabits1 = habits.filter(
    (habit) =>
      moment(habit.startDate).isSameOrBefore(moment(startDate)) &&
      moment(habit.endDate).isSameOrAfter(moment(endDate))
  );
  filteredHabits1 = filteredHabits1.map((habit) => {
    return {
      ...habit,
      totalDays: calculateDaysDifference(startDate, endDate) + 1,
    };
  });

  let filteredHabits2 = habits.filter(
    (habit) =>
      moment(habit.startDate).isSameOrBefore(moment(startDate)) &&
      moment(habit.endDate).isAfter(moment(startDate)) &&
      moment(habit.endDate).isSameOrBefore(moment(endDate))
  );

  filteredHabits2 = filteredHabits2.map((habit) => {
    return {
      ...habit,
      totalDays: calculateDaysDifference(startDate, habit.endDate) + 1,
    };
  });

  let filteredHabits3 = habits.filter(
    (habit) =>
      moment(habit.startDate).isSameOrAfter(moment(startDate)) &&
      moment(habit.startDate).isBefore(moment(endDate)) &&
      moment(habit.endDate).isSameOrAfter(moment(endDate))
  );

  filteredHabits3 = filteredHabits3.map((habit) => {
    return {
      ...habit,
      totalDays: calculateDaysDifference(habit.startDate, endDate) + 1,
    };
  });

  let filteredHabits4 = habits.filter(
    (habit) =>
      moment(habit.startDate).isSameOrAfter(moment(startDate)) &&
      moment(habit.startDate).isSameOrBefore(moment(endDate)) &&
      moment(habit.endDate).isSameOrAfter(moment(startDate)) &&
      moment(habit.endDate).isSameOrBefore(moment(endDate))
  );

  filteredHabits4 = filteredHabits4.map((habit) => {
    return {
      ...habit,
      totalDays: calculateDaysDifference(habit.startDate, habit.endDate) + 1,
    };
  });

  let totalFilteredHabits = [
    ...filteredHabits1,
    ...filteredHabits2,
    ...filteredHabits3,
    ...filteredHabits4,
  ];
  const seen = {};
  totalFilteredHabits =  totalFilteredHabits.filter(item => {
    if (seen[item._id]) {
      return false;
    } else {
      seen[item._id] = true;
      return true;
    }
  });

  totalFilteredHabits = totalFilteredHabits.map((habit) => {
    return {
      ...habit,
      totalDaysToDo: Math.ceil((habit.numDays / 7) * habit.totalDays),
      countOfDaysDone: countDoneDaysInRange(
        habit.startDate,
        habit.endDate,
        habit.daysDone
      ),
    };
  });
  try {
    res.status(200).json(totalFilteredHabits);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
