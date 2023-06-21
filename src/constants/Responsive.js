const screenClasses = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 6
};

const Responsive = {
  
    
    largerThan: (source, target) => screenClasses[source] > screenClasses[target],
    smallerThan: (source,  target) => screenClasses[source] < screenClasses[target],
    largerThanEqual: (source, target) => screenClasses[source] >= screenClasses[target],
    smallerThanEqual: (source,  target) => screenClasses[source] <= screenClasses[target]

}

export default Responsive;