export default function registerSocket(io) {
  io.on("connection", (socket) => {
    socket.on("joinPoll", (slug) => {
      socket.join(slug);
    });

    socket.on("leavePoll", (slug) => {
      socket.leave(slug);
    });

    socket.on("disconnect", () => {
      // no-op, room cleanup is automatic
    });
  });
}
